const Admin = require('../models/AdminSchema');
const User = require('../models/UserSchema');

class NotificationController {
    static notificationUser = async (req, res, next) => {
        try {
            const userId = req.userId; 
            
            const user = await User.findById(userId);  
            if (!user) return res.status(404).json({ message: "User not found" });
    
            res.json(user.notifications);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            res.status(500).json({ message: "Error fetching notifications" });
        }
    }

    static notificationAdmin = async (req, res) => {
        try {
            const admin = await Admin.findById(req.userId);
            if (!admin) {
                return res.status(403).json({ message: "Access denied" });
            }
    
            res.status(200).json(admin.notifications);
        } catch (err) {
            console.error("Admin notification fetch error:", err.message);
            res.status(500).json({ message: "Server error" });
        }
    };

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

    static adminNotificationRead = async (req, res) => {
        const { notificationId } = req.body;
    
        try {
            const admin = await Admin.findById(req.userId);
            if (!admin) {
                return res.status(403).json({ message: "Access denied" });
            }
    
            const notif = admin.notifications.id(notificationId);
            if (!notif) {
                return res.status(404).json({ message: "Notification not found" });
            }
    
            notif.read = true;
            await admin.save();
    
            res.status(200).json({ message: "Notification marked as read" });
    
        } catch (err) {
            console.error("Error marking notification:", err.message);
            res.status(500).json({ message: "Server error" });
        }
    };
    
}
module.exports = NotificationController