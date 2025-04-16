const express = require("express");
const router = express.Router();
const { upload } = require("../controllers/ProfileController");

const authMiddleware = require('../midllewares/AuthMidlleware');

const { ProfileController } = require('../controllers/ProfileController');

router.get("/profile", authMiddleware, ProfileController.getUser);
router.post("/change-profile", upload.single("profileImage"), authMiddleware, ProfileController.updateUser);
router.put("/change-password", authMiddleware, ProfileController.changePassword);
router.put("/remove-photo", authMiddleware, ProfileController.removePhoto);

module.exports = router;