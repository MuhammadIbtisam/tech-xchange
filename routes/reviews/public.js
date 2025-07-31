const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/reviewController');
const auth = require('../../middleware/auth');
const { validateReview } = require('../../validators/reviewValidators');

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);

// Authenticated routes
router.post('/product/:productId', auth, validateReview, reviewController.createReview);
router.put('/:reviewId', auth, validateReview, reviewController.updateReview);
router.delete('/:reviewId', auth, reviewController.deleteReview);
router.post('/:reviewId/helpful', auth, reviewController.markHelpful);

module.exports = router; 