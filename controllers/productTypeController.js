const ProductType = require('../models/ProductType');


exports.getAllProductTypes = async (req, res) => {
  try {
    const productTypes = await ProductType.find({ isActive: true })
      .populate('brandId', 'name')
      .populate('categoryId', 'name displayName')
      .sort({ sortOrder: 1, name: 1 });
    
    res.json({
      success: true,
      productTypes
    });
  } catch (err) {
    console.error('Get product types error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product types'
    });
  }
};

// Get product types by category (public)
exports.getProductTypesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const productTypes = await ProductType.find({ 
      categoryId, 
      isActive: true 
    })
      .populate('brandId', 'name')
      .populate('categoryId', 'name displayName')
      .sort({ sortOrder: 1, name: 1 });
    
    res.json({
      success: true,
      productTypes
    });
  } catch (err) {
    console.error('Get product types by category error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product types by category'
    });
  }
};

// Get single product type (public)
exports.getProductType = async (req, res) => {
  try {
    const productType = await ProductType.findById(req.params.id)
      .populate('brandId', 'name description')
      .populate('categoryId', 'name displayName description');
    
    if (!productType) {
      return res.status(404).json({
        success: false,
        message: 'Product type not found'
      });
    }
    
    res.json({
      success: true,
      productType
    });
  } catch (err) {
    console.error('Get product type error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product type'
    });
  }
};

// Create product type (admin only)
exports.createProductType = async (req, res) => {
  try {
    const { name, brandId, categoryId, description, specifications, image, sortOrder } = req.body;
    
    const productType = new ProductType({
      name,
      brandId,
      categoryId,
      description,
      specifications,
      image,
      sortOrder: sortOrder || 0
    });
    
    await productType.save();
    
    // Populate references for response
    await productType.populate('brandId', 'name');
    await productType.populate('categoryId', 'name displayName');
    
    res.status(201).json({
      success: true,
      message: 'Product type created successfully',
      productType
    });
  } catch (err) {
    console.error('Create product type error:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product type name already exists for this brand and category'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating product type'
    });
  }
};

// Update product type (admin only)
exports.updateProductType = async (req, res) => {
  try {
    const { name, brandId, categoryId, description, specifications, image, isActive, sortOrder } = req.body;
    
    const productType = await ProductType.findByIdAndUpdate(
      req.params.id,
      {
        name,
        brandId,
        categoryId,
        description,
        specifications,
        image,
        isActive,
        sortOrder
      },
      { new: true, runValidators: true }
    )
      .populate('brandId', 'name')
      .populate('categoryId', 'name displayName');
    
    if (!productType) {
      return res.status(404).json({
        success: false,
        message: 'Product type not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product type updated successfully',
      productType
    });
  } catch (err) {
    console.error('Update product type error:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Product type name already exists for this brand and category'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating product type'
    });
  }
};

// Delete product type (admin only)
exports.deleteProductType = async (req, res) => {
  try {
    const productType = await ProductType.findByIdAndDelete(req.params.id);
    
    if (!productType) {
      return res.status(404).json({
        success: false,
        message: 'Product type not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product type deleted successfully'
    });
  } catch (err) {
    console.error('Delete product type error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product type'
    });
  }
}; 