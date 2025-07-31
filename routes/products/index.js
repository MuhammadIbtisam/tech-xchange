const express = require('express');
const router = express.Router();

// Import sub-routes
const publicRoutes = require('./public');
const sellerRoutes = require('./seller');
const adminRoutes = require('./admin');

// Mount sub-routes
router.use('/', publicRoutes);
router.use('/seller', sellerRoutes);
router.use('/admin', adminRoutes);

module.exports = router; 