const express = require('express');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidators');

const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', auth, authController.getProfile);

module.exports = router; 