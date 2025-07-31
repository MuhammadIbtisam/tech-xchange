const express = require('express');
const productController = require('../controllers/productController');
const adminProductController = require('../controllers/adminProductController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes (for buyers)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Seller routes (requires authentication)
router.post('/', auth, productController.createProduct);
router.put('/:id', auth, productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);
router.get('/seller/my-products', auth, productController.getSellerProducts);
router.post('/:id/images', auth, uploadMultiple, handleUploadError, productController.uploadProductImages);

// Admin routes (requires admin privileges)
router.get('/admin/pending', auth, admin, adminProductController.getPendingProducts);
router.put('/admin/:id/approve', auth, admin, adminProductController.approveProduct);
router.put('/admin/:id/reject', auth, admin, adminProductController.rejectProduct);
router.get('/admin/dashboard', auth, admin, adminProductController.getDashboardStats);
router.get('/admin/all', auth, admin, adminProductController.getAllProductsForAdmin);

module.exports = router; 