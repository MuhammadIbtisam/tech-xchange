const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductType',
    required: true
  },
  // Listing-specific fields
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'used', 'refurbished'],
    required: true
  },
  images: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true,
    maxlength: 2000
    // Optional: overrides ProductType description
  },
  specifications: {
    type: Object,
    default: {}
    // Optional: overrides ProductType specifications
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'inactive'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ sellerId: 1, status: 1 });
productSchema.index({ productTypeId: 1, status: 1 });
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ price: 1, status: 1 });
productSchema.index({ condition: 1, status: 1 });
productSchema.index({ tags: 1, status: 1 });
productSchema.index({ isFeatured: 1, status: 1 });

// Text index for search functionality
productSchema.index({ 
  description: 'text', 
  tags: 'text' 
});

module.exports = mongoose.model('Product', productSchema); 