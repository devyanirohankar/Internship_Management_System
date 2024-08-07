import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1 className="home-label">Home</h1>
      <div className="login-container">
        <div className="login-section intern-login">
          <Link to="/login/intern">
            <button className="intern-button">Intern Login</button>
          </Link>
        </div>
        <div className="login-section mentor-login">
          <Link to="/login/mentor">
            <button className="mentor-button">Mentor Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
