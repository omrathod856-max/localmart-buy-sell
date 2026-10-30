const { cloudinary } = require('../config/cloudinary');
const Product = require('../models/Product');
const logger = require('../config/logger');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload/image
// @access  Private
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'localmart/products',
      resource_type: 'image',
      use_filename: false,
      unique_filename: true,
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    logger.info(`Image uploaded to Cloudinary: ${result.public_id}`);
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      image: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    logger.error('Image upload error:', error.message);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
};

// @desc    Delete image from Cloudinary (and optionally remove from product)
// @route   DELETE /api/upload/image/:publicId
// @access  Private
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;
    if (!publicId) {
      return res.status(400).json({ success: false, message: 'Public ID required' });
    }

    // Verify user owns a product with this image
    const decodedPublicId = decodeURIComponent(publicId);
    const product = await Product.findOne({
      seller: req.user._id,
      'images.publicId': decodedPublicId
    });

    if (!product) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this image' });
    }

    await cloudinary.uploader.destroy(decodedPublicId);
    logger.info(`Cloudinary image deleted: ${decodedPublicId}`);
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    logger.error('Delete image error:', error.message);
    res.status(500).json({ success: false, message: 'Image deletion failed' });
  }
};

module.exports = { uploadImage, deleteImage };
