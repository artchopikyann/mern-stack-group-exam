const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided" });
    }

    try {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_USER);
        } catch (userError) {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_ADMIN);
        }

        req.userId = decoded.userId;
        req.adminId = decoded.adminId || null;
        req.userRole = decoded.role;

        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;