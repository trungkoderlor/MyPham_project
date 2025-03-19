const Notification = require('../../models/notification.model');
module.exports.notification = async (req, res, next) => {
  try {
    const notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .limit(20);
    
    res.locals.notifications = notifications;
    
    res.locals.unreadNotificationsCount = await Notification.countDocuments({ isRead: false });
    
    next();
} catch (error) {
    console.error("Notification middleware error:", error);
    next();
}
};