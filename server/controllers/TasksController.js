const Task = require("../models/TaskSchema");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

class TaskController {
    static getTasks = async (req, res) => {
        // console.log('userId:', req.userId);
        const userId = req.userId;
        const { category } = req.params;

        try {
            const query = {assignedTo: userId};
            if (category !== all) query.category = category;

            const tasks = await Task.find({ query }).select('tasks');
            res.json(tasks);
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ message: "Error fetching tasks" });
        }
    };

    static addTask = async (req, res) => {
        try {
            const file = req.file ? `/uploads/${req.file.filename}` : null;

            const newTask = new Task({
                title: req.body.title,
                description: req.body.description,
                file: file,
                status: "pending",
                assignedTo: req.userId,
                createdBy: req.adminId || req.userId
            });

            await newTask.save();
            res.json(newTask);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    static updateTask = async (req, res) => {
        const { title, status } = req.body;
        const { id } = req.params;

        try {
            const task = await Task.findById(id);
            if (!task) return res.status(404).json({ message: "Task not found" });

            // console.log('Before Update:', task);

            task.title = title || task.title;
            task.status = status || task.status;
            task.description = description || task.description;

            if (req.file) {
                // console.log('Updating file:', req.file.filename);
                task.file = `/uploads/${req.file.filename}`;
            }

            await task.save();

            // console.log('After Update:', task);

            res.json(task);
        } catch (err) {
            console.error('Error:', err.message);
            res.status(500).json({ message: "Error updating task" });
        }
    };

    static updateStatus = async (req, res) => {
        const { status } = req.body;
        const { id } = req.params;

        try {
            const task = await Task.findById(id);

            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }

            task.status = status;

            await task.save();
            res.json(task);  
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "Error updating task status" });
        }
    };

    static deleteTask = async (req, res) => {
        const { id } = req.params;

        try {
            const deleted = await Task.findByIdAndDelete(id);
            if (!deleted) return res.status(404).json({ message: "Task not found" });

            res.json({ message: "Task deleted successfully" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Error deleting task" });
        }
    };

}


module.exports = { TaskController, upload };




