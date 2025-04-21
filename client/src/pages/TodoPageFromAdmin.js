import React, { useState, useEffect } from "react";
import TaskModal from '../components/TaskModal';
import { Link } from 'react-router-dom'

function App() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/users");
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        getUsers();
    }, []);

    return (
        <div className="general">
            <h1>Task Management</h1>

            <div className='card'>
                <div className='card-row'>
                    <div className="card-header">
                        <h2 className="card-title">User Management</h2>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user, index) => {
                                    return (
                                        <tr key={user._id}>
                                            <td>{index + 1}</td>
                                            <td className='td-name'>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>{user.status}</td>
                                            <td className='admin-btn'>
                                                <button
                                                    className="open-modal-btn"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowModal(true);
                                                    }}>
                                                    Add Task
                                                </button>
                                            </td>
                                            <td>
                                                <Link to={`/user-tasks/${user._id}`}>View Tasks</Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && selectedUser && (
                <TaskModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    selectedUser={selectedUser}  
                    userId={selectedUser._id}    
                />
            )}
        </div>
    );
}

export default App;
