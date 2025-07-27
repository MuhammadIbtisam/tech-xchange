const express = require('express');
const productTypeController = require('../controllers/productTypeController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Public routes
router.get('/', productTypeController.getAllProductTypes);
router.get('/category/:categoryId', productTypeController.getProductTypesByCategory);
router.get('/:id', productTypeController.getProductType);

// Admin routes
router.post('/', auth, admin, productTypeController.createProductType);
router.put('/:id', auth, admin, productTypeController.updateProductType);
router.delete('/:id', auth, admin, productTypeController.deleteProductType);

module.exports = router; 