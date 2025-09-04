const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
    required: true
  },
  shippingAddress: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'overnight'],
    default: 'standard'
  },
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  estimatedDelivery: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  cancelledAt: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ sellerId: 1, createdAt: -1 });
orderSchema.index({ productId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ trackingNumber: 1 });

module.exports = mongoose.model('Order', orderSchema); 