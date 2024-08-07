import axios from 'axios';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './InternView.css'; // Import the CSS file

const InternView = () => {
  const [showForm, setShowForm] = useState(false);
  const [internDetails, setInternDetails] = useState({
    Name: '',
    Email: '',
    City: '',
    College: '',
    Contact: ''
  });
  const [interns, setInterns] = useState([]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  const fetchInterns = async () => {
    try {
      const response = await axios.get('http://localhost:3000/interns');
      setInterns(response.data);
    } catch (error) {
      console.error('Error fetching interns:', error);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInternDetails({
      ...internDetails,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(internDetails).forEach((field) => {
      if (!internDetails[field]) {
        newErrors[field] = 'Please fill this field';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3000/interns', internDetails);
        setInterns([...interns, response.data]); // Append the new intern to the current state
        setInternDetails({
          Name: '',
          Email: '',
          City: '',
          College: '',
          Contact: ''
        });
        setShowForm(false);
        setAlert({ show: true, message: 'Intern Added Successfully', variant: 'success' });
      } catch (error) {
        console.error('Error adding intern:', error);
        setAlert({ show: true, message: 'Failed to add intern', variant: 'danger' });
      }
    }
  };

  const handleCloseAlert = () => setAlert({ ...alert, show: false });

  return (
    <div className="intern-view">
      <h1 className="dashboard-label">My Dashboard</h1>
      <button className="enroll-now" onClick={() => setShowForm(!showForm)}>Enroll Now</button>
      {showForm && (
        <div className="intern-form-container">
          <h2 className="intern-form-title">Intern Details</h2>
          <form className="intern-form" onSubmit={handleFormSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="Name"
              value={internDetails.Name}
              onChange={handleInputChange}
            />
            {errors.Name && <span className="error">{errors.Name}</span>}
            <label>Email</label>
            <input
              type="email"
              name="Email"
              value={internDetails.Email}
              onChange={handleInputChange}
            />
            {errors.Email && <span className="error">{errors.Email}</span>}
            <label>City</label>
            <input
              type="text"
              name="City"
              value={internDetails.City}
              onChange={handleInputChange}
            />
            {errors.City && <span className="error">{errors.City}</span>}
            <label>College</label>
            <input
              type="text"
              name="College"
              value={internDetails.College}
              onChange={handleInputChange}
            />
            {errors.College && <span className="error">{errors.College}</span>}
            <label>Contact</label>
            <input
              type="text"
              name="Contact"
              value={internDetails.Contact}
              onChange={handleInputChange}
            />
            {errors.Contact && <span className="error">{errors.Contact}</span>}
            <button type="submit" className="save-button">Save</button>
          </form>
        </div>
      )}
      <div className="intern-cards-container">
        {interns.length === 0 ? (
          <p>No data</p>
        ) : (
          interns.map((intern, index) => (
            <div key={index} className="intern-card">
              <h3>{intern.Name}</h3>
              <p>Email: {intern.Email}</p>
              <p>City: {intern.City}</p>
              <p>College: {intern.College}</p>
              <p>Contact: {intern.Contact}</p>
            </div>
          ))
        )}
      </div>
      {/* Alert container */}
      {alert.show && (
        <div className={`alert alert-${alert.variant} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={handleCloseAlert} aria-label="Close"></button>
        </div>
      )}
    </div>
  );
};

export default InternView;
