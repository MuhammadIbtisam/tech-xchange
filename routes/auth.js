const express = require('express');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const { 
  validateRegister, 
  validateLogin, 
  validateProfileUpdate, 
  validatePasswordChange 
} = require('../validators/authValidators');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);


router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getProfile);
router.put('/profile', auth, validateProfileUpdate, authController.updateProfile);
router.post('/upload-image', auth, uploadSingle, handleUploadError, authController.uploadProfileImage);
router.put('/change-password', auth, validatePasswordChange, authController.changePassword);
router.get('/stats', auth, authController.getUserStats);

module.exports = router; 