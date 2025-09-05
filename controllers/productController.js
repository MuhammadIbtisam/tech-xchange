const Product = require('../models/Product');
const ProductType = require('../models/ProductType');


exports.getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoryId,
      brandId,
      productTypeId,
      minPrice,
      maxPrice,
      condition,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status: 'approved' };
    
    if (productTypeId) filter.productTypeId = productTypeId;
    if (condition) filter.condition = condition;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .populate('sellerId', 'fullName')
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
    console.error('Get products error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

// Get single product (public)
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'fullName profileImage')
      .populate({
        path: 'productTypeId',
        populate: [
          { path: 'brandId', select: 'name description' },
          { path: 'categoryId', select: 'name displayName description' }
        ]
      });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      product
    });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

// Create product (seller only)
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      productTypeId,
      price,
      currency = 'GBP',
      condition,
      description,
      specifications,
      stock,
      tags
    } = req.body;


    if (!name || !price || !productTypeId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, price, productTypeId'
      });
    }

    // Verify product type exists
    const productType = await ProductType.findById(productTypeId);
    if (!productType) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product type'
      });
    }

    const product = new Product({
      name,
      sellerId: req.user.userId,
      productTypeId,
      price: Number(price),
      currency: currency.toUpperCase(),
      condition: condition || 'new',
      description: description || '',
      specifications: specifications || {},
      stock: Number(stock) || 1,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim())) : [],
      status: 'pending' // Goes to admin approval
    });

    await product.save();

    // Populate references for response
    await product.populate('productTypeId');
    await product.populate({
      path: 'productTypeId',
      populate: [
        { path: 'brandId', select: 'name' },
        { path: 'categoryId', select: 'name displayName' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully and sent for approval',
      product
    });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
};

// Update product (seller only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if seller owns this product
    if (product.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own products'
      });
    }

    const {
      productTypeId,
      price,
      currency,
      condition,
      description,
      specifications,
      stock,
      tags
    } = req.body;

    const updateData = {};
    if (productTypeId) updateData.productTypeId = productTypeId;
    if (price) updateData.price = Number(price);
    if (currency) updateData.currency = currency.toUpperCase();
    if (condition) updateData.condition = condition;
    if (description !== undefined) updateData.description = description;
    if (specifications) updateData.specifications = specifications;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (tags) updateData.tags = tags.split(',').map(tag => tag.trim());

    // Reset to pending status when updated
    updateData.status = 'pending';
    updateData.adminNotes = '';

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('productTypeId')
      .populate({
        path: 'productTypeId',
        populate: [
          { path: 'brandId', select: 'name' },
          { path: 'categoryId', select: 'name displayName' }
        ]
      });

    res.json({
      success: true,
      message: 'Product updated successfully and sent for re-approval',
      product: updatedProduct
    });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
};

// Delete product (seller only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if seller owns this product
    if (product.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own products'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
};

// Get seller's products (seller only)
exports.getSellerProducts = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = { sellerId: req.user.userId };
    if (status) filter.status = status;

    const products = await Product.find(filter)
      .populate('productTypeId')
      .populate({
        path: 'productTypeId',
        populate: [
          { path: 'brandId', select: 'name' },
          { path: 'categoryId', select: 'name displayName' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });
  } catch (err) {
    console.error('Get seller products error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching seller products'
    });
  }
};

// Upload product images (seller only)
exports.uploadProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if seller owns this product
    if (product.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only upload images for your own products'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No images provided'
      });
    }

    // Get relative paths for database storage
    const imagePaths = req.files.map(file => file.path.replace(/\\/g, '/'));
    
    // Add new images to existing ones
    const updatedImages = [...product.images, ...imagePaths];

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { images: updatedImages },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Product images uploaded successfully',
      images: updatedProduct.images
    });
  } catch (err) {
    console.error('Upload product images error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading product images'
    });
  }
}; 