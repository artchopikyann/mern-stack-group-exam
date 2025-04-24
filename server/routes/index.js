const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const tasksRouter = require("./tasks");
const profileRouter = require('./profile');
const notification = require('./notification');
const path = require("path");


router.use("/api", authRouter);
router.use("/tasks", tasksRouter);
router.use('/users', profileRouter);
router.use('/notifications', notification)

module.exports = router;