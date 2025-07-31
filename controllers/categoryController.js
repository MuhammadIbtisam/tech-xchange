const Category = require('../models/Category');


exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });
    
    res.json({
      success: true,
      categories
    });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
};

// Get single category (public)
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      category
    });
  } catch (err) {
    console.error('Get category error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category'
    });
  }
};

// Create category (admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, displayName, description, icon, image, sortOrder } = req.body;
    
    const category = new Category({
      name,
      displayName,
      description,
      icon,
      image,
      sortOrder: sortOrder || 0
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (err) {
    console.error('Create category error:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating category'
    });
  }
};

// Update category (admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { name, displayName, description, icon, image, isActive, sortOrder } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        displayName,
        description,
        icon,
        image,
        isActive,
        sortOrder
      },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (err) {
    console.error('Update category error:', err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating category'
    });
  }
};

// Delete category (admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category'
    });
  }
}; 