const cloudinary = require('cloudinary').v2;
const logger = require('./logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const verifyCloudinary = async () => {
  try {
    await cloudinary.api.ping();
    logger.info('Cloudinary connected successfully');
    return true;
  } catch (error) {
    logger.warn('Cloudinary connection failed - image uploads may not work:', error.message);
    return false;
  }
};

module.exports = { cloudinary, verifyCloudinary };
