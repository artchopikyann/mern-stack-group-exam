import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const { email, password } = loginData;

    if (!email.trim() || !password.trim()) {
      alert('Լրացնել բոլոր դաշտերը!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.token && data.user.role) {
        localStorage.setItem('token', data.token); 
        localStorage.setItem('role', data.user.role); 
        navigate('/todo'); 
      } else {
        setErrorMessage(data.message || 'Մուտքը չհաջողվեց');
      }
    } catch (err) {
      console.log(err.message);
      setErrorMessage('Սերվերի սխալ');
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

          <button type="submit" className="login-btn"><span></span>Login</button>
        </form>
        <h4 className="loginError">{errorMessage}</h4>
        <p>Don't have an account? <Link to="/register" className="link">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
