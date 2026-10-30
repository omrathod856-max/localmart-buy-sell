const express = require('express');
const { uploadImage, deleteImage } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/image', protect, upload.single('image'), uploadImage);
router.delete('/image/:publicId', protect, deleteImage);

module.exports = router;
