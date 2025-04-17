import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';

import Todo from './pages/TodoPage';
import Admin from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const [user, setUser] = useState({});

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
          <Route element={<Layout user={user} />}>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/todo" element={<Todo />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/profile" element={<ProfilePage setUser={setUser} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
