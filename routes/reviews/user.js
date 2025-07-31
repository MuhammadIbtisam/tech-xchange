const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/reviewController');
const auth = require('../../middleware/auth');

// User-specific routes
router.get('/my-reviews', auth, reviewController.getUserReviews);

module.exports = router; 