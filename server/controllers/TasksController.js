const User = require("../models/AuthSchema");
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
        console.log('userId:', req.userId);
        const userId = req.userId;
        const { category } = req.params;

        try {
            const user = await User.findOne({ _id: userId }).select('tasks');
            console.log("Fetched user:", user);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            let tasks;
            if (category === 'all') {
                tasks = user.tasks;
            } else {
                tasks = user.tasks.filter(task => task.status === category);
            }

            res.json(tasks);
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ message: "Error fetching tasks" });
        }
    };

    static addTask = async (req, res) => {
        try {
            const userId = req.userId;
            const file = req.file ? `/uploads/${req.file.filename}` : null;

            const user = await User.findById(userId);

            const newTask = {
                title: req.body.title,
                file,
                status: "pending",
                user: userId
            };

            user.tasks.push(newTask);
            await user.save();

            res.json(newTask);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    static updateTask = async (req, res) => {
        const { title, status } = req.body;
        const { id } = req.params;
        const userId = req.userId;

        try {
            const user = await User.findOne({ _id: userId });

            if (!user) return res.status(404).json({ message: "User not found" });

            const task = user.tasks.id(id);

            if (!task) return res.status(404).json({ message: "Task not found" });

            console.log('Before Update:', task);

            task.title = title || task.title;
            task.status = status || task.status;

            if (req.file) {
                console.log('Updating file:', req.file.filename);
                task.file = `/uploads/${req.file.filename}`;
            }

            await user.save();

            console.log('After Update:', task);

            res.json(task);
        } catch (err) {
            console.error('Error:', err.message);
            res.status(500).json({ message: "Error updating task" });
        }
    };

    static updateStatus = async (req, res) => {
        const { status } = req.body;
        const { id } = req.params;
        const userId = req.userId;  

        try {
            const user = await User.findOne({ _id: userId });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const task = user.tasks.id(id);

            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }

            task.status = status || task.status;

            await user.save();

            res.json(task);  
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "Error updating task status" });
        }
    };

    static deleteTask = async (req, res) => {
        try {
            const userId = req.userId;
            const { id } = req.params;

            const user = await User.findOne({ _id: userId });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            user.tasks = user.tasks.filter((task) => task._id.toString() !== id);

            await user.save();

            res.json({ message: "Task deleted successfully" });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "Error deleting task" });
        }
    };

}


module.exports = { TaskController, upload };




