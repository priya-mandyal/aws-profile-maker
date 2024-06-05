import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './Registration.css';

const Registration = () => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://0b62pi8zfd.execute-api.us-east-1.amazonaws.com/dev/register', {
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: password
            });
            localStorage.setItem('firstname', firstName);
            localStorage.setItem('lastname', lastName);
            navigate(`/registration-success/${username}`);
        } catch (error) {
            setMessage('Error signing up: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div className="Registration-container">
            <h1>PRIYA'S APPLICATION</h1>
            <h2>Sign Up</h2>
            <form className="Registration-form" onSubmit={handleSignUp}>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                />
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    required
                />
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Registration;
