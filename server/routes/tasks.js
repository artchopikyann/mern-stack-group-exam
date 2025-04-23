const express = require("express");
const Task = require('../models/TaskSchema');
const User = require('../models/UserSchema');
const { TaskController, upload } = require("../controllers/TasksController");
const router = express.Router();
const auth = require("../midllewares/AuthMidlleware");



router.post("/", auth, upload.single("file"), TaskController.addTask);
router.put("/:id", auth, TaskController.updateStatus);
router.put("/update-admin/:id", auth, upload.single("file"), TaskController.updateTaskAdmin);
router.put("/update-user/:id", auth, upload.single("file"), TaskController.updateTask);
router.delete("/:id", auth, TaskController.deleteTask);

router.get("/user/:userId", auth, TaskController.taskControllerFromAdmin);
router.get("/:category", auth, TaskController.getTasksFromUser);


module.exports = router;
