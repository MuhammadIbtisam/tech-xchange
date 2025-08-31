const { body, param, validationResult } = require('express-validator');

// Validation rules for creating a product
exports.validateCreateProduct = [
  body('productTypeId')
    .isMongoId()
    .withMessage('Valid product type ID is required'),
  
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  
  body('condition')
    .isIn(['new', 'like-new', 'used', 'refurbished'])
    .withMessage('Condition must be one of: new, like-new, used, refurbished'),
  
  body('stock')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Stock must be a positive integer'),
  
  body('currency')
    .optional()
    .isIn(['GBP', 'USD', 'EUR'])
    .withMessage('Currency must be GBP, USD, or EUR'),
  
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation rules for updating a product
exports.validateUpdateProduct = [
  param('id')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  
  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Price must be a positive number'),
  
  body('condition')
    .optional()
    .isIn(['new', 'like-new', 'used', 'refurbished'])
    .withMessage('Condition must be one of: new, like-new, used, refurbished'),
  
  body('stock')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Stock must be a positive integer'),
  
  body('currency')
    .optional()
    .isIn(['GBP', 'USD', 'EUR'])
    .withMessage('Currency must be GBP, USD, or EUR'),
  
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation rules for deleting a product
exports.validateDeleteProduct = [
  param('id')
    .isMongoId()
    .withMessage('Valid product ID is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];
