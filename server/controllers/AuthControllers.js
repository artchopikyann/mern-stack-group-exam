const User = require('../models/UserSchema');
const Admin = require('../models/AdminSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY_USER } = process.env;
const { JWT_SECRET_KEY_ADMIN } = process.env;

class AuthControllers {
    static register = async (req, res, next) => {
        const { username, surname, email, phoneNumber, password, repeatPassword, role } = req.body;

        try {

            if (!(username.trim(), surname.trim(), email.trim(), phoneNumber.trim(), password.trim(), repeatPassword.trim(), role)) {
                res.status(400).json({ message: 'please fill in all fields' })
            }

            if (password !== repeatPassword) {
                return res.status(400).json({ message: "Passwords do not match" });
            }

            if (role === 'admin') {
                const adminCount = await Admin.countDocuments();

                if (adminCount > 0) {
                    return res.status(403).json({ message: "Admin account already exists. Only one admin allowed." });
                }
            }

            const usernameExists = await Admin.findOne({ username }) || await User.findOne({ username });

            if (usernameExists) {
                return res.status(400).json({ message: "Username already exists" });
            }

            const emailExists = await Admin.findOne({ email }) || await User.findOne({ email });

            if (emailExists) {
                return res.status(400).json({ message: "Email already exists" });
            }

            let savedAccount;

            const hashedPassword = await bcrypt.hash(password, 12);

            if (role === 'admin') {

                const newAdmin = new Admin({
                    username,
                    surname,
                    email,
                    phoneNumber,
                    role,
                    password: hashedPassword,
                })
                savedAccount = await newAdmin.save();

            } else if (role === 'user') {

                const newUser = new User({
                    username,
                    surname,
                    email,
                    phoneNumber,
                    role,
                    password: hashedPassword,
                });

                savedAccount = await newUser.save();
            } else {
                return res.status(400).json({ message: 'Invalid role' });
            }

            res.status(201).json({ message: "User registered successfully", user: savedAccount });

        } catch (err) {
            res.json({ message: err.message });
        }
    }

    static login = async (req, res, next) => {
        const { email, password, role } = req.body;
        console.log('Received body:', req.body);
        console.log('Role:', role);


        if (!email.trim() || !password.trim()) {
            return res.status(400).json({ message: 'please fill in all fields' });
        }

        try {
            let user;

            if (role === 'admin') {
                user = await Admin.findOne({ email });
            } else if (role === 'user') {
                user = await User.findOne({ email });
            } else {
                return res.status(400).json({ message: 'Invalid role' });
            }

            if (!user) {
                return res.status(400).json({ message: 'incorrect email and password' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'incorrect email and password' });
            }

            const token = jwt.sign(
                { userId: user._id, role: user.role },
                role === 'admin' ? JWT_SECRET_KEY_ADMIN : JWT_SECRET_KEY_USER,
                { expiresIn: "24h" }
            );

            res.status(200).json({
                message: "Login successful",
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    surname: user.surname,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                    image: user.avatar,
                    number: user.phoneNumber
                }
            });

        } catch (err) {
            res.status(500).json({ message: "Server error:", error: err.message });
        }
    };
}
module.exports = AuthControllers;