import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user }) => {
    const [active, setActive] = useState('/todo');
    const [userInfo, setUserInfo] = useState([]);
    const [image, setImage] = useState('./images/default.png');

    // console.log(userInfo);

    const logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    useEffect(() => {
        if (user?.avatar) {
            setImage(`http://localhost:5000${user.avatar}`);
        }
    }, [user]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5000/users/profile", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setUserInfo(data);
                    const avatarUrl = data.avatar ? `http://localhost:5000${data.avatar}` : "./images/default.png";
                    setImage(avatarUrl);
                } else {
                    alert("Failed to load user data.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    return (
        <header>

            <div className='logo'>
                <Link to={'/todo'}>
                    <img src={'./images/logotext.png'} style={{ width: "200px" }} alt={"logo"} />
                </Link>
            </div>
            <ul>
                <li className={active === '/todo' ? 'active' : ''}>
                    <Link className="nav-link" to="/todo" onClick={() => setActive('/todo')}>Task Management</Link>
                </li>

                {userInfo.role !== 'user' ? (
                    <li className={active === '/admin' ? 'active' : ''}>
                        <Link className="nav-link" to="/admin" onClick={() => setActive('/admin')}>Admin Dashboard</Link>
                    </li>
                ): null}
                <li className={active === '/profile' ? 'active' : ''}>
                    <Link className="nav-link" to="/profile" onClick={() => setActive('/profile')}>Profile Settings</Link>
                </li>
                <li className={active === '/logout' ? 'active' : ''}>
                    <Link className="nav-link" to="#" onClick={logout}>Logout</Link>
                </li>
            </ul>

            <div className='profile'>
                <div className='profile-image'>
                    <img src={image} alt="userImage" />
                </div>
                <div className='user-data'>
                    <h3>{userInfo.username}</h3>
                    <h3>{userInfo.surname}</h3>
                </div>
            </div>
        </header>
    );
};

export default Header;
