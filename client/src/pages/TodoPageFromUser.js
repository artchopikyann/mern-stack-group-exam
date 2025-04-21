import React, { useState, useEffect } from "react";
import axios from "axios";


function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("pending");
    const [editTaskId, setEditTaskId] = useState(null);
    const [category, setCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
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
        if (!token) {
            return console.error("No token found. Please log in.");
        }

        const formData = new FormData();
        formData.append("title", title);
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
            setFile(null);
            setStatus("pending");
            setEditTaskId(null);
        } catch (error) {
            console.error("Error adding task:", error.message);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // const updateStatus = async (taskId, newStatus) => {
    //     try {
    //         await axios.put(`http://localhost:5000/tasks/${taskId}`, { status: newStatus }, {
    //             headers: {
    //                 "Authorization": `Bearer ${localStorage.getItem('token')}`,
    //             },
    //         });
    //
    //         const updatedTasks = tasks.map((task) =>
    //             task._id === taskId ? { ...task, status: newStatus } : task
    //         );
    //
    //         setTasks(updatedTasks);
    //     } catch (error) {
    //         console.error("Error updating status:", error.message);
    //         alert("Error updating task status!");
    //     }
    // };
    

    const updateTask = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("status", status);
    
        if (file) {
            formData.append("file", file);
        }
    
        try {
            const res = await axios.put(`http://localhost:5000/tasks/${editTaskId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            const updatedTasks = tasks.map((task) =>
                task._id === editTaskId
                    ? { ...task, title: title || task.title, status: status || task.status, file: res.data.file || task.file }
                    : task
            );
    
            setTasks(updatedTasks);
            setEditTaskId(null);
            setTitle("");
            setStatus("pending");
            setFile(null);
    
        } catch (error) {
            console.error("Error updating task:", error.message);
        }
    };
    

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/tasks/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            const updatedTasks = tasks.filter((task) => task._id !== id);
            setTasks(updatedTasks);
        } catch (err) {
            console.error("Error deleting task:", err.message);
            alert("Error deleting task!");
        }
    };

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

    return (
        <div className="general">
            <h1>Task Management</h1>

            <form onSubmit={editTaskId ? updateTask : addTask} className="form-container">
                <div
                    onDrop={(e) => {
                        e.preventDefault();
                        setFile(e.dataTransfer.files[0]);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById("hiddenFileInput").click()}
                    className="file-input"
                >
                    {file ? (
                        <p style={{alignItems: "center"}} className="fileinput-text"><img src='/images/file.png' alt='file' style={{width: "25px"}}/>{file.name}</p>
                    ) : (
                        <p className="fileinput-text">Drop a file or click to select one</p>
                    )}
                    <input
                        type="file"
                        id="hiddenFileInput"
                        className="file-input"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </div>

                <div id="fileName" className="file-name"></div>
                <button type="submit" className="submit-btn">
                    {editTaskId ? "Update" : "Submit"}
                </button>
            </form>
            <br />

            <div className="category">
                <div className="categoryname">Categories</div>

                <div className="categorybtn">
                    <button onClick={() => setCategory('all')}>All</button>
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
                    <li key={task._id} className="task-list-item">

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
                            <div className="task-buttons">
                                <button
                                    className="edit-button"
                                    onClick={() => {
                                        setEditTaskId(task._id);
                                        setTitle(task.title);
                                        setStatus(task.status);
                                    }}>
                                    <img src="/images/edit.png" alt={"Edit"} style={{ width: "30px" }} />
                                </button>
                                <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                                    <img src="/images/delete.png" alt={"Delete"} style={{ width: "30px" }} />
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;