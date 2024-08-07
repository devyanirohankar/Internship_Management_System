// frontend/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import InternView from './pages/InternView';
import MentorView from './pages/MentorView';
import Login from './pages/Login';

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/:role" element={<Login setAuthenticated={setAuthenticated} />} />
        <Route
          path="/intern-view"
          element={authenticated ? <InternView /> : <Navigate to="/" />}
        />
        <Route
          path="/mentor-view"
          element={authenticated ? <MentorView /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};
export default App;
