const express = require('express');
const router = express.Router();

// Import sub-routes
const userRoutes = require('./user');

// Mount sub-routes
router.use('/user', userRoutes);

module.exports = router; 