const User = require('../models/UserSchema');

class NotificationController {
    static notification = async (req, res, next) => {
        try {
            const userId = req.userId; 
            console.log(22222, userId);
            
            const user = await User.findById(userId);  
            console.log(111, user);
            if (!user) return res.status(404).json({ message: "User not found" });
    
            res.json(user.notifications);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            res.status(500).json({ message: "Error fetching notifications" });
        }
    }

    static markAsRead = async (req, res) => {
        try {
            const userId = req.userId;
            const notifId = req.params.id;
    
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });
    
            const notification = user.notifications.id(notifId);
            if (!notification) return res.status(404).json({ message: "Notification not found" });
    
            notification.read = true;
            await user.save();
    
            res.json({ message: "Notification marked as read" });
        } catch (err) {
            console.error("Error marking notification as read:", err);
            res.status(500).json({ message: "Server error" });
        }
    };
    
}
module.exports = NotificationController