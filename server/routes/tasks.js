const express = require("express");
const { TaskController, upload } = require("../controllers/TasksController");
const router = express.Router();
const auth = require("../midllewares/AuthMidlleware");

router.get("/:category", auth, TaskController.getTasks);
router.post("/", auth, upload.single("file"), TaskController.addTask);
router.put("/:id", auth, upload.single("file"), TaskController.updateTask);
router.put("/:id/status", auth, TaskController.updateStatus);
router.delete("/:id", auth, TaskController.deleteTask);

module.exports = router;
