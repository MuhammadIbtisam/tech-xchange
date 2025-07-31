const { body } = require('express-validator');

exports.validateSavedItem = [
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
    .trim()
    .escape()
]; 