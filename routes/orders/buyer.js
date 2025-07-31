const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/orderController');
const auth = require('../../middleware/auth');
const { validateOrder, validateOrderCancellation } = require('../../validators/orderValidators');

// Buyer routes
router.post('/product/:productId', auth, validateOrder, orderController.createOrder);
router.get('/my-orders', auth, orderController.getBuyerOrders);
router.get('/:orderId', auth, orderController.getOrder);
router.put('/:orderId/cancel', auth, validateOrderCancellation, orderController.cancelOrder);

module.exports = router; 