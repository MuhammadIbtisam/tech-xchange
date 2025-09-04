const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose'); // Added for database connection check

// Utility to generate JWT
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register user with role
exports.register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, role = 'buyer' } = req.body;
    
    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required.' 
      });
    }

    const existingUser = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { phoneNumber }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email or phone number already in use.' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ 
      fullName, 
      email: email.toLowerCase(), 
      phoneNumber, 
      password: hashedPassword,
      role 
    });
    
    await user.save();

    const token = generateToken(user._id, user.role);
    
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    };

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration' 
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required.' 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials.' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials.' 
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);
    
    // Return user data without password
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profileImage: user.profileImage,
      isVerified: user.isVerified,
      address: user.address,
      preferences: user.preferences,
      createdAt: user.createdAt
    };

    res.json({ 
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }
    
    res.json({ 
      success: true,
      user 
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching profile' 
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    console.log('=== PROFILE UPDATE DEBUG ===');
    console.log('User ID:', req.user.userId);
    console.log('Request Body:', req.body);
    
    const { fullName, phoneNumber, address, preferences, email } = req.body;
    
    // Validate that at least one field is provided
    if (!fullName && !phoneNumber && !address && !preferences && !email) {
      return res.status(400).json({
        success: false,
        message: 'At least one field must be provided for update'
      });
    }

    // Build update data object
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (address) updateData.address = address;
    if (preferences) updateData.preferences = preferences;
    if (email) updateData.email = email.toLowerCase();

    console.log('Update Data:', updateData);

    // Check database connection
    if (!mongoose.connection.readyState) {
      console.error('Database not connected');
      return res.status(500).json({
        success: false,
        message: 'Database connection lost'
      });
    }

    // Perform the update with proper options
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { 
        new: true,           // Return updated document
        runValidators: true, // Run schema validators
        upsert: false        // Don't create if doesn't exist
      }
    ).select('-password');

    if (!user) {
      console.error('User not found after update attempt');
      return res.status(404).json({
        success: false,
        message: 'User not found or update failed'
      });
    }

    console.log('User updated successfully');
    console.log('Updated User Data:', {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address
    });

    // Verify the update actually happened by fetching fresh data
    const verification = await User.findById(req.user.userId).select('-password');
    if (!verification) {
      console.error('Verification failed - user not found');
      throw new Error('Database update verification failed');
    }

    // Check if key fields were actually updated
    let updateVerified = true;
    if (fullName && verification.fullName !== fullName) {
      console.error('FullName update verification failed:', {
        expected: fullName,
        actual: verification.fullName
      });
      updateVerified = false;
    }
    if (email && verification.email !== email.toLowerCase()) {
      console.error('Email update verification failed:', {
        expected: email.toLowerCase(),
        actual: verification.email
      });
      updateVerified = false;
    }
    if (phoneNumber && verification.phoneNumber !== phoneNumber) {
      console.error('PhoneNumber update verification failed:', {
        expected: phoneNumber,
        actual: verification.phoneNumber
      });
      updateVerified = false;
    }

    if (!updateVerified) {
      console.error('Update verification failed');
      throw new Error('Database update verification failed - changes not persisted');
    }

    console.log('Update verification successful');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: verification
    });

  } catch (err) {
    console.error('Update profile error:', err);
    
    // Log detailed error information
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      userId: req.user.userId,
      requestBody: req.body
    });
    
    res.status(500).json({
      success: false,
      message: 'Profile update failed: ' + err.message
    });
  }
};

// Upload profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No image file provided.' 
      });
    }

    const imagePath = req.file.path;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { profileImage: imagePath },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    res.json({ 
      success: true,
      message: 'Profile image uploaded successfully',
      profileImage: user.profileImage
    });
  } catch (err) {
    console.error('Upload profile image error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while uploading image' 
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password and new password are required.' 
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: 'Current password is incorrect.' 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ 
      success: true,
      message: 'Password changed successfully' 
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while changing password' 
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during logout' 
    });
  }
};

// Get user statistics (for sellers)
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found.' 
      });
    }

    // Basic stats - can be enhanced with actual data
    const stats = {
      totalProducts: 0, // Will be calculated from Product model
      totalSales: 0,    // Will be calculated from Order model
      totalReviews: 0   // Will be calculated from Review model
    };

    res.json({ 
      success: true,
      stats 
    });
  } catch (err) {
    console.error('Get user stats error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching stats' 
    });
  }
}; 