const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');


exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, rating, sort = 'newest' } = req.query;

    const query = { productId };
    if (rating) {
      query.rating = parseInt(rating);
    }

    const sortOptions = {};
    if (sort === 'newest') {
      sortOptions.createdAt = -1;
    } else if (sort === 'oldest') {
      sortOptions.createdAt = 1;
    } else if (sort === 'rating') {
      sortOptions.rating = -1;
    } else if (sort === 'helpful') {
      sortOptions['helpful.length'] = -1;
    }

    const reviews = await Review.find(query)
      .populate('userId', 'fullName profileImage')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Review.countDocuments(query);

    // Get product details for rating summary
    const product = await Product.findById(productId).populate('productTypeId');
    const ratingStats = await Review.aggregate([
      { $match: { productId: product._id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    const ratingDistribution = ratingStats.length > 0 ? {
      5: ratingStats[0].ratingDistribution.filter(r => r === 5).length,
      4: ratingStats[0].ratingDistribution.filter(r => r === 4).length,
      3: ratingStats[0].ratingDistribution.filter(r => r === 3).length,
      2: ratingStats[0].ratingDistribution.filter(r => r === 2).length,
      1: ratingStats[0].ratingDistribution.filter(r => r === 1).length
    } : { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        },
        product: {
          id: product._id,
          title: product.productTypeId.name,
          averageRating: ratingStats.length > 0 ? Math.round(ratingStats[0].averageRating * 10) / 10 : 0,
          totalReviews: ratingStats.length > 0 ? ratingStats[0].totalReviews : 0,
          ratingDistribution
        }
      }
    });
  } catch (err) {
    console.error('Get product reviews error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
};


exports.createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    // Check if product exists and is approved
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot review unapproved products'
      });
    }


    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const review = new Review({
      productId,
      userId,
      rating,
      comment
    });

    await review.save();

    // Populate user details
    await review.populate('userId', 'fullName profileImage');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (err) {
    console.error('Create review error:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating review'
    });
  }
};

// Update user's review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    await review.populate('userId', 'fullName profileImage');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating review'
    });
  }
};

// Delete user's review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting review'
    });
  }
};

// Mark review as helpful
exports.markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }


    const alreadyHelpful = review.helpful.find(h => h.userId.toString() === userId);
    
    if (alreadyHelpful) {
      // Remove helpful vote
      review.helpful = review.helpful.filter(h => h.userId.toString() !== userId);
    } else {
      // Add helpful vote
      review.helpful.push({ userId });
    }

    await review.save();

    res.json({
      success: true,
      message: alreadyHelpful ? 'Removed helpful vote' : 'Marked as helpful',
      data: {
        helpfulCount: review.helpful.length,
        isHelpful: !alreadyHelpful
      }
    });
  } catch (err) {
    console.error('Mark helpful error:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating helpful status'
    });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ userId })
      .populate('productId', 'productTypeId')
      .populate('productId.productTypeId', 'name brandId')
      .populate('productId.productTypeId.brandId', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Review.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReviews: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (err) {
    console.error('Get user reviews error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching user reviews'
    });
  }
}; 