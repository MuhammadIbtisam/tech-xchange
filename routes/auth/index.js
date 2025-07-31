const express = require('express');
const router = express.Router();

// Import sub-routes
const publicRoutes = require('./public');
const protectedRoutes = require('./protected');

// Mount sub-routes
router.use('/', publicRoutes);
router.use('/', protectedRoutes);

module.exports = router; 