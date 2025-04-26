import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const { email, password, role } = loginData;

    if (!email.trim() || !password.trim() || !role) {
      setErrorMessage('Fill in all fields!');
      return;
    }

    const url = role === 'admin' ? 'http://localhost:5000/api/login/admin' : 'http://localhost:5000/api/login/user';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();

      if (data.token && data.user.role) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        if(data.user.role === 'user'){
          localStorage.setItem('status', data.user.status);
        }
        
        navigate('/todo');
      } else {
        setErrorMessage(data.message || 'Login failed.');
      }

      if(localStorage.getItem('status') === 'Blocked'){
        navigate('/blocked-user');
      }
    } catch (err) {
      console.log(err.message);
      setErrorMessage('Server error');
    }
  };

  const handleChange = (ev) => {
    setLoginData((prevState) => ({
      ...prevState,
      [ev.target.name]: ev.target.value,
    }));
  };

  return (
    <div className="login-container">
      <div className="login">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="input-text">Email:</label>
          <input type="email" name="email" id="email" placeholder="Email..." onChange={handleChange} />

          <label htmlFor="password" className="input-text">Password:</label>
          <input type="password" name="password" id="password" placeholder="Password..." onChange={handleChange} />

          <div className="role-container">
            <div className="role-option">
              <input type="radio" name="role" id="admin" value="admin" onChange={handleChange} />
              <label className="role-label" htmlFor="admin">Admin</label>
            </div>
            <div className="role-option">
              <input type="radio" name="role" id="user" value="user" onChange={handleChange} />
              <label className="role-label" htmlFor="user">User</label>
            </div>
          </div>

          <button type="submit" className="login-btn" style={{ marginTop: '25px' }}><span></span>Login</button>
        </form>
        <h4 className="loginError">{errorMessage}</h4>
        <p>Don't have an account? <Link to="/register" className="link">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
