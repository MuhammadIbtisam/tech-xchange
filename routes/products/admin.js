const express = require('express');
const router = express.Router();
const adminProductController = require('../../controllers/adminProductController');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// Admin routes (requires admin privileges)
router.get('/pending', auth, admin, adminProductController.getPendingProducts);
router.put('/:id/approve', auth, admin, adminProductController.approveProduct);
router.put('/:id/reject', auth, admin, adminProductController.rejectProduct);
router.get('/dashboard', auth, admin, adminProductController.getDashboardStats);
router.get('/all', auth, admin, adminProductController.getAllProductsForAdmin);

module.exports = router; 