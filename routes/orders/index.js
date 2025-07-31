const express = require('express');
const router = express.Router();

// Import sub-routes
const buyerRoutes = require('./buyer');
const sellerRoutes = require('./seller');

// Mount sub-routes
router.use('/buyer', buyerRoutes);
router.use('/seller', sellerRoutes);

module.exports = router; 