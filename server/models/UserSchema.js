const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["user"],
        default: "user",
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "blocked", "deleted"],
        default: "active"
    },
    notificationsEnabled: {
        type: Boolean, default: true
    },
    avatar: {
        type: String,
        default: ""
    },
    tasks: [{
        title: { type: String, required: true },
        file: { type: String },
        status: { type: String, enum: ["pending", "inprogress", "completed"], default: "pending" },
        description: { type: String },
        notifications: { type: Boolean, default: true },
    }]
});

module.exports = mongoose.model("User", UserSchema);
