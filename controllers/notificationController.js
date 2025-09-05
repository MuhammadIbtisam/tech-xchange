const Notification = require('../models/Notification');

// Get user's notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const query = { userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .populate('relatedId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalNotifications: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        },
        unreadCount
      }
    });
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only mark your own notifications as read'
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read'
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (err) {
    console.error('Mark all as read error:', err);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read'
    });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own notifications'
      });
    }

    await Notification.findByIdAndDelete(notificationId);

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (err) {
    console.error('Delete notification error:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification'
    });
  }
};

// Delete all notifications
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.deleteMany({ userId });

    res.json({
      success: true,
      message: 'All notifications deleted successfully'
    });
  } catch (err) {
    console.error('Delete all notifications error:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting all notifications'
    });
  }
};

// Get notification count
exports.getNotificationCount = async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await Notification.countDocuments({ userId, isRead: false });
    const totalCount = await Notification.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        unreadCount,
        totalCount
      }
    });
  } catch (err) {
    console.error('Get notification count error:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching notification count'
    });
  }
}; 