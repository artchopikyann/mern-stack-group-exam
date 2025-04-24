import React, { useState, useEffect } from 'react';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

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

    useEffect(() => {
        fetch("http://localhost:5000/api/stats")
            .then((res) => res.json())
            .then((data) => setTotal(data))
            .catch((err) => console.error("Error fetching total:", err));
    }, []);

    const updateUserStatus = async (id, status) => {
        const checkRole = localStorage.getItem('role');
        if (checkRole === 'user') {
            alert('փոփոխություն կարող է անել միայն ադմինը');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/users/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            const updatedUser = await response.json();

            if(updatedUser.status === 'Blocked'){

            }

            if (updatedUser.message) {
                console.error(updatedUser.message);
                alert(updatedUser.message);
            } else {
                setUsers((prevUsers) =>
                    prevUsers.map((user) => (user._id === id ? updatedUser : user))
                );
            }
        } catch (err) {
            console.error("Error updating user status:", err);
        }
    };

    const deleteUser = async (id) => {
        const checkRole = localStorage.getItem('role');
        if (checkRole === 'user') {
            alert('Օգտվողը կարող է ջնջել միայն ադմինը');
            return;
        }

        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            });

            const data = await response.json();

            if (data.message === "User successfully deleted") {
                setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Error deleting user:", err);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin">
            <h1>Admin Dashboard</h1>
            <div className='row-admin'>
                <div className='user-info'>
                    {
                        total.map((el, index) => {
                            return (
                                <div key={index + 1} className='item'>
                                    <p>{el.title}</p>
                                    <h2>{el.count}</h2>
                                </div>
                            )
                        })
                    }
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

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
                                    filteredUsers.map((user, index) => {
                                        return (
                                            <tr key={user._id}>
                                                <td>{index + 1}</td>
                                                <td className='td-name'>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{user.status}</td>
                                                <td className='admin-btn'>
                                                    <button onClick={() => updateUserStatus(user._id, "Active")}>Active</button>
                                                    <button onClick={() => updateUserStatus(user._id, "Blocked")}>Blocked</button>
                                                    <button onClick={() => deleteUser(user._id)}>Delete</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Admin
