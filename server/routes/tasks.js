    const express = require("express");
    const Task = require('../models/TaskSchema');
    const User = require('../models/UserSchema');
    const { TaskController, upload } = require("../controllers/TasksController");
    const router = express.Router();
    const auth = require("../midllewares/AuthMidlleware");


    router.get("/:category", auth, TaskController.getTasksFromUser);
    router.post("/", auth, upload.single("file"), TaskController.addTask);
    router.put("/:id/status", auth, TaskController.updateStatus);
    router.put("/:id", auth, upload.single("file"), TaskController.updateTask);
    router.delete("/:id", auth, TaskController.deleteTask);

    router.get("/user/:userId", auth, TaskController.taskControllerFromAdmin);

    module.exports = router;
