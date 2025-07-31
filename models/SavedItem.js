const mongoose = require('mongoose');

const savedItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Indexes for better performance
savedItemSchema.index({ userId: 1, createdAt: -1 });
savedItemSchema.index({ productId: 1 });

// Compound index to ensure one saved item per user per product
savedItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('SavedItem', savedItemSchema); 