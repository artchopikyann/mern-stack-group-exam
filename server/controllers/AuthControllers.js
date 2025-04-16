const User = require('../models/AuthSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY_USER } = process.env;

class AuthControllers {
    static register = async (req, res, next) => {
        const { username, surname, email, phoneNumber, password, repeatPassword } = req.body;

        if (password !== repeatPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({
                username,
                surname,
                email,
                phoneNumber,
                password: hashedPassword,
            });

            const savedUser = await newUser.save();

            res.status(201).json({ message: "User registered successfully", user: savedUser });

        } catch (err) {
            res.json({ message: err.message });
        }
    }

    static login = async (req, res, next) => {
        const { email, password } = req.body;

        if(!email.trim() || !password.trim()){
            res.status(400).json({message: 'please fill in all fields'})
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'incorrect email and password' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'incorrect email and password' });
            }

            const token = jwt.sign(
                { userId: user._id, role: user.role },
                JWT_SECRET_KEY_USER,
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