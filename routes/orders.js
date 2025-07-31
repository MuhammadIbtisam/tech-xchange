const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const { validateOrder, validateOrderStatus, validateOrderCancellation } = require('../validators/orderValidators');

// Buyer routes
router.post('/product/:productId', auth, validateOrder, orderController.createOrder);
router.get('/buyer/my-orders', auth, orderController.getBuyerOrders);
router.get('/:orderId', auth, orderController.getOrder);
router.put('/:orderId/cancel', auth, validateOrderCancellation, orderController.cancelOrder);

// Seller routes
router.get('/seller/my-orders', auth, orderController.getSellerOrders);
router.put('/:orderId/status', auth, validateOrderStatus, orderController.updateOrderStatus);

module.exports = router; 