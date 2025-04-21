import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function UserTasksPage() {
    const { userId } = useParams();

    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    console.log(tasks)

    console.log(tasks)


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
            } catch (err) {
                console.error("Error fetching tasks:", err);
                setError("Failed to fetch tasks. Please try again later.");
            }
        };
        fetchUserTasks();
    }, [userId]);

    return (
        <div className="general">
            <h1>User's Tasks</h1>

            <ul className="task-list">
                {tasks.map((task) => (
                    <li key={task._id} className="task-list-item" style={{display: 'flex'}}>

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
                        </div>
                        <div className="task-buttons">
                            <button
                                className="edit-button"
                                onClick={() => {
                                    // setEditTaskId(task._id);
                                    // setTitle(task.title);
                                    // setStatus(task.status);
                                }}>
                                <img src="/images/edit.png" alt={"Edit"} style={{ width: "30px" }} />
                            </button>
                            <button className="delete-btn" onClick={() => { }}>
                                <img src="/images/delete.png" alt={"Delete"} style={{ width: "30px" }} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

        </div >
    );
}

export default UserTasksPage;
