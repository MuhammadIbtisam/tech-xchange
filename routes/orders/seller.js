const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');
const auth = require('../../middleware/auth');
const { validateOrderStatus } = require('../../validators/orderValidators');

// Seller routes
router.get('/my-orders', auth, orderController.getSellerOrders);
router.put('/:orderId/status', auth, validateOrderStatus, orderController.updateOrderStatus);

module.exports = router; 