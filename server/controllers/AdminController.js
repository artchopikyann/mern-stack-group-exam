const User = require('../models/UserSchema');

class AdminController {
    static getAllUsers = async (req, res, next) => {
        const user = await User.find();
        res.json(user);
    }

    static updateUserStatus = async (req, res, next) => {
        const { id } = req.params;
        let { status } = req.body;


        const validStatu = ["Active", "Blocked", "Deleted"];
        if (!validStatu.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        try {
            const user = await User.findByIdAndUpdate(id, { status }, { new: true });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    };

    static getStatistics = async (req, res, next) => {
        try {
            const stats = [
                { title: "Total Users", count: await User.countDocuments() },
                { title: "Active Users", count: await User.countDocuments({ status: "Active" }) },
                { title: "Blocked Users", count: await User.countDocuments({ status: "Blocked" }) },
                { title: "Deleted Users", count: await User.countDocuments({ status: "Deleted" }) }
            ];
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    }
}
module.exports = AdminController;
