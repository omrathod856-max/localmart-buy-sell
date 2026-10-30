const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');
const logger = require('../config/logger');

// @desc    Get all products (with filters)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      condition,
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    const query = { status: 'active' };

    if (search) {
      query.$text = { $search: search };
    }
    if (category) query.category = category;
    if (condition) query.condition = condition;
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const allowedSorts = ['-createdAt', 'createdAt', 'price', '-price', '-views'];
    const sortField = allowedSorts.includes(sort) ? sort : '-createdAt';

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('seller', 'name email location phone')
        .sort(sortField)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    logger.error('Get products error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email location phone bio createdAt');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json({ success: true, product });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    logger.error('Get product error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch product' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, condition, location, images } = req.body;

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      condition,
      location,
      images: images || [],
      seller: req.user._id
    });

    const populated = await product.populate('seller', 'name email location');

    logger.info(`Product created: ${product._id} by ${req.user._id}`);
    res.status(201).json({ success: true, message: 'Product listed successfully', product: populated });
  } catch (error) {
    logger.error('Create product error:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(422).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this listing' });
    }

    const { title, description, price, category, condition, location, status, images } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, description, price: Number(price), category, condition, location, status, images },
      { new: true, runValidators: true }
    ).populate('seller', 'name email location');

    logger.info(`Product updated: ${product._id} by ${req.user._id}`);
    res.json({ success: true, message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    logger.error('Update product error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    // Delete Cloudinary images
    for (const image of product.images) {
      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
          logger.info(`Deleted Cloudinary image: ${image.publicId}`);
        } catch (cloudErr) {
          logger.warn(`Failed to delete Cloudinary image ${image.publicId}:`, cloudErr.message);
        }
      }
    }

    await product.deleteOne();
    logger.info(`Product deleted: ${product._id} by ${req.user._id}`);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    logger.error('Delete product error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};

// @desc    Get my listings
// @route   GET /api/products/my-listings
// @access  Private
const getMyListings = async (req, res) => {
  try {
    const { page = 1, limit = 12, status } = req.query;
    const query = { seller: req.user._id };
    if (status) query.status = status;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort('-createdAt')
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      products,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum }
    });
  } catch (error) {
    logger.error('Get my listings error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch your listings' });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getMyListings };
