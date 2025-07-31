const { body } = require('express-validator');

exports.validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters')
    .trim()
    .escape()
]; 