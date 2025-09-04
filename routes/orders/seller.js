const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');
const auth = require('../../middleware/auth');
const seller = require('../../middleware/seller');
const { validateOrderStatus } = require('../../validators/orderValidators');

// Seller routes - require both auth and seller role
router.get('/my-orders', auth, seller, orderController.getSellerOrders);
router.put('/:orderId/status', auth, seller, orderController.updateOrderStatus);

module.exports = router; 