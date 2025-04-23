const express = require('express');
const router = express.Router();
const { getAllUsers , updateUserStatus, getStatistics, deleteUser} = require('../controllers/AdminController')

router.get('/users', getAllUsers);
router.put("/users/:id/status", updateUserStatus);
router.get("/stats", getStatistics);
router.delete("/users/:id", deleteUser);

module.exports = router;