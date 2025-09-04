const SavedItem = require('../models/SavedItem');
const Product = require('../models/Product');

// Add product to saved items
exports.addToSavedItems = async (req, res) => {
  try {
    console.log('=== ADD TO SAVED ITEMS DEBUG ===');
    console.log('Product ID:', req.params.productId);
    console.log('User from token:', req.user);
    console.log('Request body:', req.body);
    
    const { productId } = req.params;
    const { notes } = req.body;
    const userId = req.user.userId || req.user.id; // Fix: Use userId from JWT token

    console.log('Extracted User ID:', userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Check if product exists and is approved
    const product = await Product.findById(productId);
    if (!product) {
      console.log('Product not found:', productId);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('Product found:', product.name);

    if (product.status !== 'approved') {
      console.log('Product not approved:', product.status);
      return res.status(400).json({
        success: false,
        message: 'Cannot save unapproved products'
      });
    }

    // Check if already saved
    const existingSavedItem = await SavedItem.findOne({ userId, productId });
    if (existingSavedItem) {
      console.log('Product already saved');
      return res.status(400).json({
        success: false,
        message: 'Product is already in your saved items'
      });
    }

    console.log('Creating new saved item');

    const savedItem = new SavedItem({
      userId,
      productId,
      notes
    });

    await savedItem.save();
    console.log('Saved item created:', savedItem._id);

    // Populate product details
    await savedItem.populate([
      { path: 'productId', populate: { path: 'productTypeId', populate: 'brandId' } },
      { path: 'productId.sellerId', select: 'fullName' }
    ]);

    console.log('Saved item populated successfully');

    res.status(201).json({
      success: true,
      message: 'Product added to saved items',
      data: savedItem
    });
  } catch (err) {
    console.error('Add to saved items error:', err);
    res.status(500).json({
      success: false,
      message: 'Error adding to saved items'
    });
  }
};

// Get user's saved items
exports.getSavedItems = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id; // Fix: Use userId from JWT token
    const { page = 1, limit = 10 } = req.query;

    const savedItems = await SavedItem.find({ userId })
      .populate('productId', 'productTypeId sellerId price currency condition stock')
      .populate('productId.productTypeId', 'name brandId')
      .populate('productId.productTypeId.brandId', 'name')
      .populate('productId.sellerId', 'fullName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await SavedItem.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        savedItems,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (err) {
    console.error('Get saved items error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved items'
    });
  }
};

// Update saved item notes
exports.updateSavedItem = async (req, res) => {
  try {
    const { savedItemId } = req.params;
    const { notes } = req.body;
    const userId = req.user.userId || req.user.id; // Fix: Use userId from JWT token

    const savedItem = await SavedItem.findById(savedItemId);
    if (!savedItem) {
      return res.status(404).json({
        success: false,
        message: 'Saved item not found'
      });
    }

    if (savedItem.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own saved items'
      });
    }

    savedItem.notes = notes;
    await savedItem.save();

    await savedItem.populate([
      { path: 'productId', populate: { path: 'productTypeId', populate: 'brandId' } },
      { path: 'productId.sellerId', select: 'fullName' }
    ]);

    res.json({
      success: true,
      message: 'Saved item updated successfully',
      data: savedItem
    });
  } catch (err) {
    console.error('Update saved item error:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating saved item'
    });
  }
};

// Remove from saved items
exports.removeFromSavedItems = async (req, res) => {
  try {
    const { savedItemId } = req.params;
    const userId = req.user.userId || req.user.id; // Fix: Use userId from JWT token

    const savedItem = await SavedItem.findById(savedItemId);
    if (!savedItem) {
      return res.status(404).json({
        success: false,
        message: 'Saved item not found'
      });
    }

    if (savedItem.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only remove your own saved items'
      });
    }

    await SavedItem.findByIdAndDelete(savedItemId);

    res.json({
      success: true,
      message: 'Product removed from saved items'
    });
  } catch (err) {
    console.error('Remove from saved items error:', err);
    res.status(500).json({
      success: false,
      message: 'Error removing from saved items'
    });
  }
};

exports.checkIfSaved = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId || req.user.id; // Fix: Use userId from JWT token

    const savedItem = await SavedItem.findOne({ userId, productId });

    res.json({
      success: true,
      data: {
        isSaved: !!savedItem,
        savedItem: savedItem || null
      }
    });
  } catch (err) {
    console.error('Check if saved error:', err);
    res.status(500).json({
      success: false,
      message: 'Error checking saved status'
    });
  }
}; 