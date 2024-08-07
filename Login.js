import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = ({ setAuthenticated }) => {
  const { role } = useParams(); // Extract role from route parameters
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate(); // Hook for navigation

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const validCredentials = {
      intern: { username: 'intern', password: 'intern123' },
      mentor: { username: 'mentor', password: 'mentor123' },
    };

    if (
      credentials.username === validCredentials[role].username &&
      credentials.password === validCredentials[role].password
    ) {
      setMessage({ text: 'Login successful!', type: 'success' });
      setAuthenticated(true);
      setTimeout(() => {
        if (role === 'intern') {
          navigate('/intern-view');
        } else if (role === 'mentor') {
          navigate('/mentor-view');
        }
      }, 1000);
    } else {
      setMessage({ text: 'Invalid username or password', type: 'error' });
    }
  };

  return (
    <div className="login-container">
      <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      <form onSubmit={handleLogin} className="login-form">
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={credentials.username}
          onChange={handleInputChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
