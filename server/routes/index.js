const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const tasksRouter = require("./tasks");
const profileRouter = require('./profile');

router.use("/api", authRouter);
router.use("/tasks", tasksRouter);
router.use('/users', profileRouter);

module.exports = router;