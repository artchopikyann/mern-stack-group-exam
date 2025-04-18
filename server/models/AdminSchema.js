const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
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
});

module.exports = mongoose.model("Admin", AdminSchema);
