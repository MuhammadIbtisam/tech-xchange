const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationController');
const auth = require('../../middleware/auth');

// User notification routes
router.get('/my-notifications', auth, notificationController.getNotifications);
router.get('/count', auth, notificationController.getNotificationCount);
router.put('/:notificationId/read', auth, notificationController.markAsRead);
router.put('/mark-all-read', auth, notificationController.markAllAsRead);
router.delete('/:notificationId', auth, notificationController.deleteNotification);
router.delete('/delete-all', auth, notificationController.deleteAllNotifications);

module.exports = router; 