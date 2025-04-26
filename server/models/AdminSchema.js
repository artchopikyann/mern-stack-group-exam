const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    surname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    notificationsEnabled: {
        type: Boolean, default: true
    },
    avatar: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["admin"],
        default: "admin",
    },
    assignedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
    }],
    notifications: [{
        message: { type: String, required: true },
        date: { type: Date, default: Date.now },
        read: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model("Admin", AdminSchema);
