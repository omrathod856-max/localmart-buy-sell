const express = require('express');
const { body, query, param } = require('express-validator');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyListings
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const productValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('price').isFloat({ min: 0, max: 1000000 }).withMessage('Price must be between 0 and 1,000,000'),
  body('category').isIn([
    'Electronics', 'Clothing', 'Furniture', 'Books', 'Sports',
    'Toys', 'Vehicles', 'Real Estate', 'Food', 'Services', 'Other'
  ]).withMessage('Invalid category'),
  body('condition').isIn(['New', 'Like New', 'Good', 'Fair', 'Poor']).withMessage('Invalid condition')
];

// My listings must come before /:id route
router.get('/my-listings', protect, getMyListings);

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, productValidation, validate, createProduct);
router.put('/:id', protect, productValidation, validate, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
