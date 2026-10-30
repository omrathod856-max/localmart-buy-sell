const mongoose = require('mongoose');
const logger = require('./logger');

const cleanMongoUri = (uri) => {
  if (!uri) return uri;
  let clean = uri.trim();
  // Strip enclosing quotes if accidentally added in dashboard
  clean = clean.replace(/^["']+|["']+$/g, '');
  
  // mongodb+srv URIs cannot have a port number in the host part (after @)
  if (clean.startsWith('mongodb+srv://')) {
    const atIndex = clean.lastIndexOf('@');
    if (atIndex !== -1) {
      const auth = clean.slice(0, atIndex + 1);
      let hostAndOptions = clean.slice(atIndex + 1);
      // Remove any :12345 port before / or ?
      hostAndOptions = hostAndOptions.replace(/:(\d+)(?=[/?]|$)/, '');
      clean = auth + hostAndOptions;
    }
  }
  return clean;
};

const connectDB = async () => {
  try {
    const uri = cleanMongoUri(process.env.MONGODB_URI);
    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
