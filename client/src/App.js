import React, { useState , useEffect} from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';

import TodoPageFromAdmin from './pages/TodoPageFromAdmin';
import TodoPageFromUser from './pages/TodoPageFromUser'
import Admin from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import UserTasksPage from './pages/UserTasksPage';
import BlockedUserPage from './pages/BlockedUserPage';
import NotificationsUser from './components/NotificationsUser';

function App() {
  const [user, setUser] = useState({}); 
  const [notifications, setNotifications] = useState([]);

  const role = localStorage.getItem('role');

  const darkModeFunc = () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.querySelector('body');

    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  };

    useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get('http://localhost:5000/notifications', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setNotifications(response.data);
        } catch (err) {
          console.error("Error fetching notifications:", err);
        } 
      };
  
      fetchNotifications(); 
    }, []);
  
  
  // useEffect(() => {
  //   const hasUnread = notifications.some(notif => !notif.read);
  //   const notif = document.querySelector('.notif span');
  //   if(hasUnread){
  //     notif.classList.add('active');
  //   }
  // }, [notifications])

  const openCloseMenu = () => {
    const header = document.querySelector('header');
    header.classList.toggle('active');
  }

  return (
    <div className="App">
      <i id="theme-toggle" className="fa-solid fa-circle-half-stroke" onClick={darkModeFunc}></i>
      <i className="fa-solid fa-bars" onClick={openCloseMenu}></i>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blocked-user" element={< BlockedUserPage />} />
          <Route element={<Layout user={user} />}>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/todo" element={role === 'admin' ? <TodoPageFromAdmin  /> : <TodoPageFromUser />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<ProfilePage setUser={setUser} />} />
            <Route path="/user-tasks/:userId" element={< UserTasksPage />} />
            <Route path="/notifications" element={< NotificationsUser setNotifications={setNotifications} notifications={notifications}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
