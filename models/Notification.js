const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'order_created',
      'order_confirmed', 
      'order_shipped',
      'order_delivered',
      'order_cancelled',
      'product_approved',
      'product_rejected',
      'new_review',
      'price_drop',
      'stock_update',
      'payment_success',
      'payment_failed'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  relatedModel: {
    type: String,
    enum: ['Product', 'Order', 'Review'],
    required: false
  },
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better performance
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ relatedId: 1, relatedModel: 1 });

module.exports = mongoose.model('Notification', notificationSchema); 