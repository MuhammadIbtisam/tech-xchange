const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  },
  profileImage: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  preferences: {
    currency: {
      type: String,
      default: 'GBP'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ role: 1, isVerified: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema); 