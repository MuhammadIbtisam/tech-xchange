const Brand = require('../models/Brand');

// Get all brands (public)
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });
    
    res.json({
      success: true,
      brands
    });
  } catch (err) {
    console.error('Get brands error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching brands'
    });
  }
};

// Get single brand (public)
exports.getBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    res.json({
      success: true,
      brand
    });
  } catch (err) {
    console.error('Get brand error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching brand'
    });
  }
};

// Get brand with product types (public)
exports.getBrandWithTypes = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }

    // Populate product types for this brand
    const ProductType = require('../models/ProductType');
    const productTypes = await ProductType.find({ 
      brandId: brand._id, 
      isActive: true 
    }).populate('categoryId', 'name displayName');

    res.json({
      success: true,
      brand,
      productTypes
    });
  } catch (err) {
    console.error('Get brand with types error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching brand with types'
    });
  }
};

// Create brand (admin only)
exports.createBrand = async (req, res) => {
  try {
    const { name, description, logo, website, sortOrder } = req.body;
    
    const brand = new Brand({
      name,
      description,
      logo,
      website,
      sortOrder: sortOrder || 0
    });
    
    await brand.save();
    
    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      brand
    });
  } catch (err) {
    console.error('Create brand error:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Brand name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating brand'
    });
  }
};

// Update brand (admin only)
exports.updateBrand = async (req, res) => {
  try {
    const { name, description, logo, website, isActive, sortOrder } = req.body;
    
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        logo,
        website,
        isActive,
        sortOrder
      },
      { new: true, runValidators: true }
    );
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Brand updated successfully',
      brand
    });
  } catch (err) {
    console.error('Update brand error:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Brand name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating brand'
    });
  }
};

// Delete brand (admin only)
exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Brand deleted successfully'
    });
  } catch (err) {
    console.error('Delete brand error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting brand'
    });
  }
}; 