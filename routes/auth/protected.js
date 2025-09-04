const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const authController = require('../../controllers/authController');
const { 
  validateProfileUpdate, 
  validatePasswordChange 
} = require('../../validators/authValidators');
const { uploadSingle, handleUploadError } = require('../../middleware/upload');
const mongoose = require('mongoose');

// Protected routes
router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getProfile);
router.put('/profile', auth, validateProfileUpdate, authController.updateProfile);
router.post('/upload-image', auth, uploadSingle, handleUploadError, authController.uploadProfileImage);
router.put('/change-password', auth, validatePasswordChange, authController.changePassword);
router.get('/stats', auth, authController.getUserStats);

// Database health check endpoint
router.get('/health', auth, async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const statusText = {
      0: 'disconnected',
      1: 'connected', 
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      success: true,
      database: {
        status: dbStatus,
        statusText: statusText[dbStatus],
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 