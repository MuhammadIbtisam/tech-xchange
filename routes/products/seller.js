const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const auth = require('../../middleware/auth');
const { uploadMultiple, handleUploadError } = require('../../middleware/upload');

// Seller routes (requires authentication)
router.post('/', auth, productController.createProduct);
router.put('/:id', auth, productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);
router.get('/my-products', auth, productController.getSellerProducts);
router.post('/:id/images', auth, uploadMultiple, handleUploadError, productController.uploadProductImages);

module.exports = router; 