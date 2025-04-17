import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [registerData, setRegisterData] = useState({
        username: '',
        surname: '',
        email: '',
        phoneNumber: '',
        password: '',
        repeatPassword: ''
    });

    const navigate = useNavigate();

    const handleChange = (ev) => {
        setRegisterData((prevState) => ({
            ...prevState,
            [ev.target.name]: ev.target.value
        }))
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        const { username, surname, email, phoneNumber, password, repeatPassword } = registerData;

        if (!username.trim() || !surname.trim() || !email.trim() || !phoneNumber.trim() || !password.trim() || !repeatPassword.trim()) {
            alert('խնդրում ենք լրացնել բոլոր դաշտերը');
            return;
        }

        if (password !== repeatPassword) {
            alert('Գաղտնաբառերը չեն համընկնում');
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerData),
            });

            const data = await response.json();
            alert(data.message);

            navigate('/login');

        } catch (err) {
            console.error("Error:", err);
        }
    };


    return (
        <div className='register-container'>
            <div className='register'>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username" className='register-text-label'>Name:</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Name..."
                        value={registerData.username}
                        onChange={handleChange}
                    />

                    <label htmlFor='surname' className='register-text-label'>Surname:</label>
                    <input
                        type='text'
                        name='surname'
                        id='surname'
                        placeholder='Surname...'
                        value={registerData.surname}
                        onChange={handleChange}
                    />

                    <label htmlFor='email' className='register-text-label'>Email:</label>
                    <input
                        type='email'
                        name='email'
                        id='email'
                        placeholder='Email...'
                        value={registerData.email}
                        onChange={handleChange}
                    />

                    <label htmlFor='phoneNumber' className='register-text-label'>Phone Number:</label>
                    <input
                        type='tel'
                        name='phoneNumber'
                        id='phoneNumber'
                        placeholder='Phone Number...'
                        value={registerData.phoneNumber}
                        onChange={handleChange}
                    />

                    <label htmlFor='password' className='register-text-label'>Password:</label>
                    <input
                        type='password'
                        name='password'
                        id='password'
                        placeholder='Password...'
                        value={registerData.password}
                        onChange={handleChange}
                    />

                    <label htmlFor='repeatPassword' className='register-text-label'>Repeat Password:</label>
                    <input
                        type='password'
                        name='repeatPassword'
                        id='repeatPassword'
                        placeholder='Repeat Password...'
                        value={registerData.repeatPassword}
                        onChange={handleChange}
                    />

                    <button type='submit' className='register-btn'><span></span>Register</button>
                </form>
                <p>Are you already registered? <Link to={'/login'} className='link'>Login</Link></p>
            </div>
        </div>

    );
};

export default Register;