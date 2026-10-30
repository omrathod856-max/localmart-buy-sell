const express = require('express');
const mongoose = require('mongoose');
const logger = require('../config/logger');

const router = express.Router();

// @desc    Basic health check
// @route   GET /api/health
// @access  Public
router.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'LocalMart API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
});

// @desc    Database health check
// @route   GET /api/health/db
// @access  Public
router.get('/db', async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    const stateName = stateMap[state] || 'unknown';
    const isHealthy = state === 1;

    if (isHealthy) {
      // Ping the database
      await mongoose.connection.db.admin().ping();
    }

    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      database: {
        status: stateName,
        host: isHealthy ? mongoose.connection.host : null
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('DB health check error:', error.message);
    res.status(503).json({
      success: false,
      database: { status: 'error', error: 'Database connectivity failed' },
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
