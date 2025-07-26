const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  specifications: {
    type: Object,
    default: {}
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
productTypeSchema.index({ brandId: 1, categoryId: 1 });
productTypeSchema.index({ name: 1 });
productTypeSchema.index({ isActive: 1, sortOrder: 1 });

// Compound index for unique product types within brand-category combination
productTypeSchema.index({ brandId: 1, categoryId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('ProductType', productTypeSchema); 