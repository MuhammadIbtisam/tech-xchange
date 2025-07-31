const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./auth');
const categoryRoutes = require('./categories');
const brandRoutes = require('./brands');
const productTypeRoutes = require('./productTypes');
const productRoutes = require('./products');
const reviewRoutes = require('./reviews');
const orderRoutes = require('./orders');
const savedItemRoutes = require('./saved-items');
const notificationRoutes = require('./notifications');

// Health check route
router.get('/', (req, res) => {
  res.json({ 
    message: 'Tech-Xchange API is running',
    version: '1.0.0',
    status: 'active'
  });
});

// Mount routes with nested structure
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/product-types', productTypeRoutes);
router.use('/products', productRoutes);
router.use('/reviews', reviewRoutes);
router.use('/orders', orderRoutes);
router.use('/saved-items', savedItemRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router; 