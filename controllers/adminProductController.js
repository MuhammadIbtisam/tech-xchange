const Product = require('../models/Product');

// Get pending products for approval (admin only)
exports.getPendingProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({ status: 'pending' })
      .populate('sellerId', 'fullName email')
      .populate('productTypeId')
      .populate({
        path: 'productTypeId',
        populate: [
          { path: 'brandId', select: 'name' },
          { path: 'categoryId', select: 'name displayName' }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments({ status: 'pending' });
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalPending: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('Get pending products error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pending products'
    });
  }
};

// Approve product (admin only)
exports.approveProduct = async (req, res) => {
  try {
    const adminNotes = req.body?.adminNotes || '';
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user.userId,
        approvedAt: new Date(),
        adminNotes
      },
      { new: true }
    )
      .populate('sellerId', 'fullName email')
      .populate('productTypeId')
      .populate({
        path: 'productTypeId',
        populate: [
          { path: 'brandId', select: 'name' },
          { path: 'categoryId', select: 'name displayName' }
        ]
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product approved successfully',
      product
    });
  } catch (err) {
    console.error('Approve product error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while approving product'
    });
  }
};

// Reject product (admin only)
exports.rejectProduct = async (req, res) => {
  try {
    const adminNotes = req.body?.adminNotes;
    
    if (!adminNotes) {
      return res.status(400).json({
        success: false,
        message: 'Admin notes are required for rejection'
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        adminNotes,
        approvedBy: req.user.userId,
        approvedAt: new Date()
      },
      { new: true }
    )
      .populate('sellerId', 'fullName email')
      .populate('productTypeId')
      .populate({
        path: 'productTypeId',
        populate: [
          { path: 'brandId', select: 'name' },
          { path: 'categoryId', select: 'name displayName' }
        ]
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product rejected successfully',
      product
    });
  } catch (err) {
    console.error('Reject product error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting product'
    });
  }
};

// Get admin dashboard stats (admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      pendingProducts,
      approvedProducts,
      rejectedProducts,
      totalSellers,
      totalViews
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'pending' }),
      Product.countDocuments({ status: 'approved' }),
      Product.countDocuments({ status: 'rejected' }),
      Product.distinct('sellerId').countDocuments(),
      Product.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ])
    ]);

    const totalViewsCount = totalViews.length > 0 ? totalViews[0].totalViews : 0;

    // Recent activity
    const recentProducts = await Product.find()
      .populate('sellerId', 'fullName')
      .populate('productTypeId')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalProducts,
        pendingProducts,
        approvedProducts,
        rejectedProducts,
        totalSellers,
        totalViews: totalViewsCount
      },
      recentProducts
    });
  } catch (err) {
    console.error('Get dashboard stats error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard stats'
    });
  }
};


exports.getAllProductsForAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sellerId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (sellerId) filter.sellerId = sellerId;
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .populate('sellerId', 'fullName email')
      .populate('productTypeId')
      .populate({
        path: 'productTypeId',
        populate: [
          { path: 'brandId', select: 'name' },
          { path: 'categoryId', select: 'name displayName' }
        ]
      })
      .sort(sort)
      .limit(limit)
      .skip(skip);

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalProducts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('Get all products for admin error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
}; 