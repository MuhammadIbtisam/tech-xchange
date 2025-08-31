const User = require('../models/User');

const seller = async (req, res, next) => {
  try {
    // Check if user exists and is a seller
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Seller role required'
      });
    }

    // Add user info to request for use in controllers
    req.seller = user;
    next();
  } catch (error) {
    console.error('Seller middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authorization'
    });
  }
};

module.exports = seller;
