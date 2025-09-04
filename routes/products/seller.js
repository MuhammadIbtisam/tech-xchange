const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');
const auth = require('../../middleware/auth');
const seller = require('../../middleware/seller');
const { uploadMultiple, handleUploadError } = require('../../middleware/upload');
const { validateCreateProduct, validateUpdateProduct, validateDeleteProduct } = require('../../validators/productValidators');

// Seller routes (requires authentication and seller role)
router.post('/', auth, seller, validateCreateProduct, productController.createProduct);
router.put('/:id', auth, seller, validateUpdateProduct, productController.updateProduct);
router.delete('/:id', auth, seller, validateDeleteProduct, productController.deleteProduct);
router.get('/my-products', auth, seller, productController.getSellerProducts);
router.post('/:id/images', auth, seller, uploadMultiple, handleUploadError, productController.uploadProductImages);

module.exports = router; 