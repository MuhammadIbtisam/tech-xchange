const { body, validationResult } = require('express-validator');

const validateRegister = [
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('phoneNumber')
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['buyer', 'seller', 'admin'])
    .withMessage('Role must be buyer, seller, or admin'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];

const validateProfileUpdate = [
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters')
    .trim()
    .escape(),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
    .trim(),
  
  body('phoneNumber')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required')
    .trim(),
  
  body('address.street')
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage('Street address must be between 5 and 100 characters')
    .trim()
    .escape(),
  
  body('address.city')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters')
    .trim()
    .escape(),
  
  body('address.state')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters')
    .trim()
    .escape(),
  
  body('address.zipCode')
    .optional()
    .isPostalCode('any')
    .withMessage('Valid zip code is required')
    .trim(),
  
  body('address.country')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters')
    .trim()
    .escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];

const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];

module.exports = { 
  validateRegister, 
  validateLogin, 
  validateProfileUpdate, 
  validatePasswordChange 
}; 