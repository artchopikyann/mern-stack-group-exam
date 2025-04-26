import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function UserTasksPage() {
    const { userId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editStatus, setEditStatus] = useState("pending");
    const [editDeadline, setEditDeadline] = useState("");
    const [editFile, setEditFile] = useState(null);

    const [taskWarnings, setTaskWarnings] = useState({});
    const [taskErrors, setTaskErrors] = useState({});

    useEffect(() => {
        const fetchUserTasks = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:5000/tasks/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTasks(response.data);

                // Ստուգել task-երի warning/error վիճակները
                const warnings = {};
                const errors = {};

                const today = new Date();

                response.data.forEach(task => {
                    if (task.deadline) {
                        const deadlineDate = new Date(task.deadline);
                        const diffTime = deadlineDate.getTime() - today.getTime();
                        const diffDays = diffTime / (1000 * 3600 * 24);

                        if (diffDays < 0) {
                            errors[task._id] = "❌ Task deadline missed!";
                        } else if (diffDays <= 1) {
                            warnings[task._id] = "⚠️ Deadline is near!";
                        }
                    }
                });

                setTaskWarnings(warnings);
                setTaskErrors(errors);

            } catch (err) {
                console.error("Error fetching tasks:", err);
                setError("Failed to fetch tasks. Please try again later.");
            }
        };
        fetchUserTasks();
    }, [userId]);

    const handleDelete = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        } catch (err) {
            console.error("Error deleting task:", err);
            alert("Failed to delete the task. Try again.");
        }
    };

    const handleEdit = (task) => {
        setEditTaskId(task._id);
        setEditTitle(task.title);
        setEditDescription(task.description || "");
        setEditStatus(task.status);
        setEditDeadline(task.deadline ? task.deadline.split('T')[0] : "");
        setEditFile(null);
    };

    const handleUpdate = async () => {
        if (!editTitle || !editDescription || !editDeadline) {
            alert("Please fill in all fields before updating.");
            return;
        }

        const formData = new FormData();
        formData.append("title", editTitle);
        formData.append("description", editDescription);
        formData.append("deadline", editDeadline);
        formData.append("status", editStatus);
        formData.append('notification', '');

        if (editFile) {
            formData.append("file", editFile);
        }

        try {
            const response = await axios.put(`http://localhost:5000/tasks/update-admin/${editTaskId}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === editTaskId
                        ? { ...task, ...response.data }
                        : task
                )
            );

            setEditTaskId(null);
            setEditTitle("");
            setEditDescription("");
            setEditStatus("pending");
            setEditDeadline("");
            setEditFile(null);
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    return (
        <div className="general">
            <h1>User's Tasks</h1>

            <ul className="task-list">
                {tasks.length > 0 ? (
                    tasks.map((task) => {
                        let backgroundColor = "white";
                        if (taskErrors[task._id]) {
                            backgroundColor = "#ffcccc";
                        } else if (taskWarnings[task._id]) {
                            backgroundColor = "#fff3cd";
                        }

                        return (
                            <li key={task._id} className="task-list-item" style={{ backgroundColor, display: 'flex', alignItems: 'center' }}>
                                {editTaskId === task._id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            placeholder="Title"
                                        />
                                        <textarea
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            placeholder="Description"
                                        />
                                        <input
                                            type="date"
                                            value={editDeadline}
                                            onChange={(e) => setEditDeadline(e.target.value)}
                                        />
                                        <input
                                            type="file"
                                            onChange={(e) => setEditFile(e.target.files[0])}
                                        />
                                        <div className="edit-buttons">
                                            <button onClick={handleUpdate} className="save-button">Save</button>
                                            <button onClick={() => setEditTaskId(null)} className="cancel-button">Close</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="task-list">
                                            <div className="row-todo">
                                                <div className="status-box">
                                                    <div className={task.status} id="status">
                                                        <p className="status-text">
                                                            {task.status === "inprogress"
                                                                ? "In Progress"
                                                                : task.status === "pending"
                                                                    ? "Pending"
                                                                    : "Completed"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="task-list-title">{task.title}</div>
                                                <div className="task-descr">{task.description}</div>
                                            </div>
                                            <div className="task-buttons-box">
                                                <div className="task-buttons">
                                                    <button className="edit-button" onClick={() => handleEdit(task)}>
                                                        <img src="/images/edit.png" alt="Edit" style={{ width: "30px" }} />
                                                    </button>
                                                    <button className="delete-btn" onClick={() => handleDelete(task._id)}>
                                                        <img src="/images/delete.png" alt="Delete" style={{ width: "30px" }} />
                                                    </button>
                                                    {task.status === 'completed' && task.file && (
                                                        <button className="download-btn">
                                                            <a href={`http://localhost:5000/download/${task.file}`} download>
                                                                <img src="/images/file.png" alt="File" style={{ width: "30px" }} />
                                                            </a>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="foot">
                                                <p className="task-dater">
                                                    {task.creationDay.slice(0, 10)} / {task.deadline.slice(0, 10)}
                                                </p>

                                                {taskErrors[task._id] && (
                                                    <p style={{ color: "red", fontWeight: "bold" }}>{taskErrors[task._id]}</p>
                                                )}
                                                {taskWarnings[task._id] && (
                                                    <p style={{ color: "orange", fontWeight: "bold" }}>{taskWarnings[task._id]}</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </li>
                        );
                    })
                ) : (
                    <p style={{textAlign: 'center', fontSize: '18px', marginTop: '10px', color: 'red'}}>No tasks found</p>
                )}
            </ul>
        </div>
    );
}

export default UserTasksPage;
