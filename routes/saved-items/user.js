const express = require('express');
const router = express.Router();
const savedItemController = require('../../controllers/savedItemController');
const auth = require('../../middleware/auth');
const { validateSavedItem } = require('../../validators/savedItemValidators');

// User saved items routes
router.post('/product/:productId', auth, validateSavedItem, savedItemController.addToSavedItems);
router.get('/my-saved-items', auth, savedItemController.getSavedItems);
router.put('/:savedItemId', auth, validateSavedItem, savedItemController.updateSavedItem);
router.delete('/:savedItemId', auth, savedItemController.removeFromSavedItems);
router.get('/check/:productId', auth, savedItemController.checkIfSaved);

module.exports = router; 