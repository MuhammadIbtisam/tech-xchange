const { body } = require('express-validator');

exports.validateOrder = [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  
  body('paymentMethod')
    .isIn(['credit_card', 'card', 'paypal', 'bank_transfer', 'cash_on_delivery'])
    .withMessage('Invalid payment method'),
  
  body('shippingAddress.street')
    .isLength({ min: 5, max: 100 })
    .withMessage('Street address must be between 5 and 100 characters'),
  
  body('shippingAddress.city')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('shippingAddress.state')
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  
  body('shippingAddress.zipCode')
    .isLength({ min: 3, max: 10 })
    .withMessage('Zip code must be between 3 and 10 characters'),
  
  body('shippingAddress.country')
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters'),
  
  body('shippingAddress.phone')
    .isMobilePhone()
    .withMessage('Invalid phone number'),
  
  body('shippingMethod')
    .optional()
    .isIn(['standard', 'express', 'overnight'])
    .withMessage('Invalid shipping method'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
];

exports.validateOrderStatus = [
  body('status')
    .isIn(['confirmed', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  
  body('trackingNumber')
    .optional()
    .isLength({ min: 5, max: 50 })
    .withMessage('Tracking number must be between 5 and 50 characters'),
  
  body('estimatedDelivery')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for estimated delivery')
];

exports.validateOrderCancellation = [
  body('reason')
    .isLength({ min: 10, max: 200 })
    .withMessage('Cancellation reason must be between 10 and 200 characters')
    .trim()
    .escape()
]; 