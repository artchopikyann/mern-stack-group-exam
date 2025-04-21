const User = require('../models/UserSchema');
const Admin = require('../models/AdminSchema');
const bcrypt = require('bcrypt');

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads-image"),
    filename: (req, file, cb) =>
        cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({storage});

class ProfileController {
    static getUser = async (req, res) => {
        try {
            const user = await User.findById(req.userId) || await Admin.findById(req.userId)

                if (!user) {
                    return res.status(404).json({message: "User not found"});
                }

            const responseUser = {
                id: user._id,
                username: user.username,
                surname: user.surname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                avatar: user.avatar,
                role: req.userRole,
            };
            // console.log(user.phoneNumber)


            res.json(responseUser);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    };

    static updateUser = async (req, res) => {
        const {firstName, lastName, email, phone} = req.body;
        const profileImage = req.file ? req.file.filename : null;
        const userId = req.userId;

        // console.log("Uploaded file:", req.file);

        try {
            const user = await User.findById(req.userId) || await Admin.findById(req.userId)

                if (!user) {
                    return res.status(404).json({message: "User not found"});
                }

            user.username = firstName || user.username;
            user.surname = lastName || user.surname;
            user.email = email || user.email;
            user.phoneNumber = phone || user.phoneNumber;

            if (profileImage) {
                user.avatar = `/uploads-image/${profileImage}`;
            }

            await user.save();
            res.status(200).json({message: "Profile updated successfully", avatar: user.avatar});
        } catch (err) {
            console.error("Error:", err);
            res.status(500).json({message: "Error updating profile", error: err.message});
        }
    };

    static changePassword = async (req, res) => {
        try {
            const {currentPassword, newPassword} = req.body;
            const user = await User.findById(req.userId) || await Admin.findById(req.userId)

                if (!user) {
                    return res.status(404).json({message: "User not found"});
                }

            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({message: "Current password is incorrect"});
            }

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            res.json({message: "Password updated successfully"});
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    };

    static removePhoto = async (req, res) => {
        try {
            const user = await User.findById(req.userId) || await Admin.findById(req.userId)

            if (!user) {
                return res.status(404).json({message: "User not found"});
            }

            user.avatar = null;
            await user.save();
            res.status(200).json({message: "Photo removed"});
        } catch (err) {
            res.status(500).json({message: "Photo dont removing", error: err.message});
        }
    };
}

module.exports = {ProfileController, upload};
