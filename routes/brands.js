const express = require('express');
const brandController = require('../controllers/brandController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Public routes
router.get('/', brandController.getAllBrands);
router.get('/:id', brandController.getBrand);
router.get('/:id/types', brandController.getBrandWithTypes);

// Admin routes
router.post('/', auth, admin, brandController.createBrand);
router.put('/:id', auth, admin, brandController.updateBrand);
router.delete('/:id', auth, admin, brandController.deleteBrand);

module.exports = router; 