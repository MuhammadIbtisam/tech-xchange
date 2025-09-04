const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');


exports.createOrder = async (req, res) => {
  try {
    console.log('🛒 === ORDER CREATION DEBUG ===');
    console.log('Full request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('req.user:', req.user);
    console.log('req.user.userId:', req.user?.userId);
    console.log('req.user.id:', req.user?.id);
    console.log('=== END DEBUG ===');

    const { productId } = req.params;
    const { quantity = 1, paymentMethod, shippingAddress, shippingMethod = 'standard', notes } = req.body;
    
    // Extract buyerId from JWT token (not from request body for security)
    const buyerId = req.user.userId || req.user.id;
    
    if (!buyerId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Validate required fields
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // Validate shipping address fields
    const requiredAddressFields = ['street', 'city', 'state', 'zipCode', 'country', 'phone'];
    for (const field of requiredAddressFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({
          success: false,
          message: `Shipping address ${field} is required`
        });
      }
    }

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Validate product exists and is approved
    const product = await Product.findById(productId).populate('sellerId', 'fullName');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot order unapproved products'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Calculate shipping cost based on method
    const shippingCosts = {
      standard: 5.99,
      express: 12.99,
      overnight: 24.99
    };

    const shippingCost = shippingCosts[shippingMethod] || 5.99;
    const totalAmount = (product.price * quantity) + shippingCost;

    const order = new Order({
      buyerId,
      sellerId: product.sellerId._id,
      productId,
      quantity,
      unitPrice: product.price,
      totalAmount,
      currency: product.currency,
      paymentMethod,
      shippingAddress,
      shippingMethod,
      shippingCost,
      notes
    });

    await order.save();

    // Update product stock
    product.stock -= quantity;
    await product.save();

    // Create notification for seller
    const notification = new Notification({
      userId: product.sellerId._id,
      type: 'order_created',
      title: 'New Order Received',
      message: `You have received a new order for ${product.productTypeId?.name || 'Product'}`,
      relatedId: order._id,
      relatedModel: 'Order',
      metadata: {
        orderId: order._id,
        productName: product.productTypeId?.name || 'Product',
        quantity,
        totalAmount
      }
    });
    await notification.save();

    // Populate order details
    await order.populate([
      { path: 'productId', populate: { path: 'productTypeId', populate: 'brandId' } },
      { path: 'sellerId', select: 'fullName email' },
      { path: 'buyerId', select: 'fullName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (err) {
    console.error('Create order error:', err);
    
    // Handle specific validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate order detected'
      });
    }
    
    // Handle cast errors (invalid ObjectId)
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get buyer's orders
exports.getBuyerOrders = async (req, res) => {
  try {
    const buyerId = req.user.userId || req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { buyerId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('productId', 'productTypeId')
      .populate('productId.productTypeId', 'name brandId')
      .populate('productId.productTypeId.brandId', 'name')
      .populate('sellerId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (err) {
    console.error('Get buyer orders error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// Get seller's orders
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId || req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { sellerId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('productId', 'productTypeId')
      .populate('productId.productTypeId', 'name brandId')
      .populate('productId.productTypeId.brandId', 'name')
      .populate('buyerId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (err) {
    console.error('Get seller orders error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// Get specific order
exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId || req.user.id;

    const order = await Order.findById(orderId)
      .populate('productId', 'productTypeId')
      .populate('productId.productTypeId', 'name brandId')
      .populate('productId.productTypeId.brandId', 'name')
      .populate('sellerId', 'fullName email')
      .populate('buyerId', 'fullName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }


    if (order.buyerId._id.toString() !== userId && order.sellerId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
};

// Update order status (seller)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, estimatedDelivery } = req.body;
    const sellerId = req.user.userId || req.user.id;

    console.log('=== ORDER STATUS UPDATE DEBUG ===');
    console.log('Order ID:', orderId);
    console.log('New Status:', status);
    console.log('Tracking Number:', trackingNumber);
    console.log('Estimated Delivery:', estimatedDelivery);
    console.log('Seller ID:', sellerId);

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log('Current Order Status:', order.status);
    console.log('Order Seller ID:', order.sellerId);

    if (order.sellerId.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own orders'
      });
    }

    // Validate status transition
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: ['refunded'],
      cancelled: [],
      refunded: []
    };

    console.log('Valid transitions for current status:', validTransitions[order.status]);

    // Check if current status has valid transitions
    if (!validTransitions[order.status]) {
      return res.status(400).json({
        success: false,
        message: `Invalid current order status: ${order.status}`
      });
    }

    // Check if the new status is a valid transition
    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${order.status} to ${status}. Valid transitions are: ${validTransitions[order.status].join(', ')}`
      });
    }

    console.log('Status transition is valid');

    // Update order status
    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;

    await order.save();
    console.log('Order saved with new status:', order.status);

    // Create notification for buyer
    const notificationTypes = {
      confirmed: 'order_confirmed',
      shipped: 'order_shipped',
      delivered: 'order_delivered',
      cancelled: 'order_cancelled',
      refunded: 'order_refunded'
    };

    if (notificationTypes[status]) {
      const notification = new Notification({
        userId: order.buyerId,
        type: notificationTypes[status],
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your order has been ${status}`,
        relatedId: order._id,
        relatedModel: 'Order',
        metadata: {
          orderId: order._id,
          status,
          trackingNumber
        }
      });
      await notification.save();
      console.log('Notification created for buyer');
    }

    await order.populate([
      { path: 'productId', populate: { path: 'productTypeId', populate: 'brandId' } },
      { path: 'sellerId', select: 'fullName' },
      { path: 'buyerId', select: 'fullName' }
    ]);

    console.log('Order populated and ready to return');

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
};

// Cancel order (buyer)
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const buyerId = req.user.userId || req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.buyerId.toString() !== buyerId) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own orders'
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelledBy = buyerId;
    order.cancellationReason = reason;

    await order.save();

    // Restore product stock
    const product = await Product.findById(order.productId);
    if (product) {
      product.stock += order.quantity;
      await product.save();
    }

    // Create notification for seller
    const notification = new Notification({
      userId: order.sellerId,
      type: 'order_cancelled',
      title: 'Order Cancelled',
      message: 'An order has been cancelled by the buyer',
      relatedId: order._id,
      relatedModel: 'Order',
      metadata: {
        orderId: order._id,
        reason
      }
    });
    await notification.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (err) {
    console.error('Cancel order error:', err);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order'
    });
  }
}; 