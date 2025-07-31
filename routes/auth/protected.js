const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const authController = require('../../controllers/authController');
const { 
  validateProfileUpdate, 
  validatePasswordChange 
} = require('../../validators/authValidators');
const { uploadSingle, handleUploadError } = require('../../middleware/upload');

// Protected routes
router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getProfile);
router.put('/profile', auth, validateProfileUpdate, authController.updateProfile);
router.post('/upload-image', auth, uploadSingle, handleUploadError, authController.uploadProfileImage);
router.put('/change-password', auth, validatePasswordChange, authController.changePassword);
router.get('/stats', auth, authController.getUserStats);

module.exports = router; 