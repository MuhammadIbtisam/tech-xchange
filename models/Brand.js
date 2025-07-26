const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    default: null
  },
  website: {
    type: String,
    trim: true
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
brandSchema.index({ name: 1 });
brandSchema.index({ isActive: 1, sortOrder: 1 });

module.exports = mongoose.model('Brand', brandSchema); 