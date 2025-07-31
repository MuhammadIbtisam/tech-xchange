const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  images: [{
    type: String,
    trim: true
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  helpful: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better performance
reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isVerified: 1 });

// Compound index to ensure one review per user per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 