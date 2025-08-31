const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const auth = require('../../middleware/auth');
const seller = require('../../middleware/seller');
const admin = require('../../middleware/admin');
const { uploadMultiple, handleUploadError } = require('../../middleware/upload');
const { 
  validateCreateProduct, 
  validateUpdateProduct, 
  validateDeleteProduct 
} = require('../../validators/productValidators');

// Import sub-routes
const publicRoutes = require('./public');
const sellerRoutes = require('./seller');
const adminRoutes = require('./admin');

// Main product endpoints (seller operations)
router.post('/', auth, seller, validateCreateProduct, productController.createProduct);
router.put('/:id', auth, seller, validateUpdateProduct, productController.updateProduct);
router.delete('/:id', auth, seller, validateDeleteProduct, productController.deleteProduct);

// Mount sub-routes
router.use('/', publicRoutes);
router.use('/seller', sellerRoutes);
router.use('/admin', adminRoutes);

module.exports = router; 