const express = require('express');
const router = express.Router();

// Import sub-routes
const publicRoutes = require('./public');
const userRoutes = require('./user');

// Mount sub-routes
router.use('/', publicRoutes);
router.use('/user', userRoutes);

module.exports = router; 