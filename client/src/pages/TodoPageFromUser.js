import React, { useState, useEffect } from "react";
import axios from "axios";
import UserTaskModal from "../components/UserTaskModal";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("pending");
    const [editTaskId, setEditTaskId] = useState(null);
    const [category, setCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        console.log(tasks);
        const fetchTasks = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`http://localhost:5000/tasks/${category}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setTasks(res.data);
            } catch (err) {
                console.error("Error fetching tasks:", err.message);
            }
        };

        fetchTasks();
    }, [category]);

    const addTask = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) return console.error("No token found. Please log in.");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("status", "pending");
        if (file) formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:5000/tasks", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });
            setTasks([...tasks, res.data]);
            setTitle("");
            setDescription("");
            setFile(null);
            setStatus("pending");
            setEditTaskId(null);
        } catch (error) {
            console.error("Error adding task:", error.message);
        }
    };

    const updateTask = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("status", status);
        if (file) formData.append("file", file);

     console.log(editTaskId)
        try {
            const res = await axios.put(`http://localhost:5000/tasks/update-user/${editTaskId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            });


            const updatedTasks = tasks.map((task) =>
                task._id === editTaskId
                    ? { ...task, title: title || task.title, description: description || task.description, status: status || task.status, file: res.data.task.file || task.file }
                    : task
            );

            setTasks(updatedTasks);
            setEditTaskId(null);
            setTitle("");
            setDescription("");
            setStatus("pending");
            setFile(null);
            setModalOpen(false);
        } catch (error) {
            console.error("Error updating task:", error.message);
        }
    };

    const updateStatus = async (taskId, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/tasks/${taskId}`, { status: newStatus }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const updatedTasks = tasks.map((task) =>
                task._id === taskId ? { ...task, status: newStatus } : task
            );

            setTasks(updatedTasks);
        } catch (error) {
            console.error("Error updating status:", error.message);
            alert("Error updating task status!");
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        if (e.target.files[0]) {
            setStatus("completed");
        } else {
            setStatus("pending");
        }
    };

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="general">
            <h1>Task Management</h1>

            <div className="category">
                <div className="categoryname">Categories</div>
                <div className="categorybtn">
                    <button onClick={() => setCategory('all')}>All</button>
                    <button onClick={() => setCategory('pending')}>Pending</button>
                    <button onClick={() => setCategory('inprogress')}>In Progress</button>
                    <button onClick={() => setCategory('completed')}>Completed</button>
                </div>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search my tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <ul className="task-list">
                {filteredTasks.map((task) => (
                    <li key={task._id} className="task-list-item" onClick={() => {
                        updateStatus(task._id, 'inprogress');
                        setTitle(task.title);
                        setDescription(task.description || "");
                        setStatus(task.status);
                        setFile(null);
                        setEditTaskId(task._id);
                        setModalOpen(true);
                    }}>
                        <div className="task-list-title">{task.title}</div>
                        <div className="row-todo">
                            <div className={task.status} id="status">
                                <p className="status-text">
                                    {task.status === "inprogress"
                                        ? "In Progress"
                                        : task.status === "pending"
                                            ? "Pending"
                                            : "Completed"}
                                </p>
                            </div>
                            <div className="task-descr">{task.description}</div>
                            <div className="task-date">
                                {task.creationDay?.slice(0, 10)} / {task.deadline?.slice(0, 10)}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {modalOpen && (
                <UserTaskModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    editTaskId={editTaskId}
                    updateTask={updateTask}
                    addTask={addTask}
                    file={file}
                    setFile={setFile}
                    onChange={handleFileChange}
                    task={tasks}
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    status={status}
                    setStatus={setStatus}
                />
            )}
        </div>
    );
}

export default App;
