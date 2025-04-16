const express = require('express');
const router = express.Router();
const { getAllUsers , updateUserStatus, getStatistics} = require('../controllers/AdminController')

router.get('/users', getAllUsers);
router.put("/users/:id/status", updateUserStatus);
router.get("/stats", getStatistics);

module.exports = router;