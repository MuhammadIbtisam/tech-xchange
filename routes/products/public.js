const express = require('express');
const router = express.Router();
const productController = require('../../controllers/productController');

// Public routes (for buyers)
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

module.exports = router; 