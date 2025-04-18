// const mongoose = require('mongoose');
//
// const UsserSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true
//     },
//     surname: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     phoneNumber: {
//         type: Number,
//         required: true,
//         unique: true
//     },
//     role: {
//         type: String,
//         enum: ["user", "admin"],
//         default: "user"
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     notificationsEnabled: {
//         type: Boolean, default: true
//     },
//     avatar: {
//         type: String,
//         default: ""
//     },
//     tasks: [{
//         title: { type: String, required: true },
//         file: { type: String },
//         status: { type: String, enum: ["pending", "inprogress", "completed"], default: "pending" },
//         description: { type: String },
//         notifications: { type: Boolean, default: true },
//     }]
// });
//
// module.exports = mongoose.model("Usser", UsserSchema);
