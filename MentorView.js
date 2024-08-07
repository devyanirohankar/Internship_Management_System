import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Alert, Button, Form, Table, Tabs, Tab, Toast } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MentorView.css';

const MentorView = () => {
  const [activeTab, setActiveTab] = useState('batches');
  const [batches, setBatches] = useState([]);
  const [interns, setInterns] = useState([]);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showInternForm, setShowInternForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedIntern, setSelectedIntern] = useState(null);

  const [batchDetails, setBatchDetails] = useState({
    Title: '',
    Duration: '',
    Created_on: '',
    Description: ''
  });

  const [internDetails, setInternDetails] = useState({
    Name: '',
    Email: '',
    BatchID: '',
    College: '',
    Contact: '',
    City: ''
  });

  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    fetchBatches();
    fetchInterns();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get('http://localhost:3000/batch');
      const sortedBatches = response.data.sort((a, b) => new Date(b.Created_on) - new Date(a.Created_on));
      setBatches(sortedBatches);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const fetchInterns = async () => {
    try {
      const response = await axios.get('http://localhost:3000/mentor_interns');
      setInterns(response.data); // Assuming response.data is an array of interns
    } catch (error) {
      console.error('Error fetching interns:', error);
    }
  };

  const handleBatchInputChange = (e) => {
    const { name, value } = e.target;
    setBatchDetails({
      ...batchDetails,
      [name]: value
    });
  };

  const handleInternInputChange = (e) => {
    const { name, value } = e.target;
    setInternDetails({
      ...internDetails,
      [name]: value
    });
  };

  const handleBatchFormSubmit = async (e) => {
    e.preventDefault();

    if (!batchDetails.Title || !batchDetails.Duration || !batchDetails.Created_on || !batchDetails.Description) {
      setAlert({ show: true, message: 'All fields are required', variant: 'danger' });
      return;
    }

    try {
      if (isUpdating && selectedBatch) {
        await axios.put(`http://localhost:3000/batch/${selectedBatch.id}`, batchDetails);
        const updatedBatches = batches.map(batch =>
          batch.id === selectedBatch.id ? { ...batch, ...batchDetails } : batch
        );
        setBatches(updatedBatches.sort((a, b) => new Date(b.Created_on) - new Date(a.Created_on)));
        setIsUpdating(false);
        setSelectedBatch(null);
        setBatchDetails({ Title: '', Duration: '', Created_on: '', Description: '' });
        setShowBatchForm(false);
        setAlert({ show: true, message: 'Batch updated successfully', variant: 'success' });
      } else {
        const response = await axios.post('http://localhost:3000/batch', batchDetails);
        setBatches([...batches, response.data].sort((a, b) => new Date(b.Created_on) - new Date(a.Created_on)));
        setBatchDetails({ Title: '', Duration: '', Created_on: '', Description: '' });
        setShowBatchForm(false);
        setAlert({ show: true, message: 'Batch added successfully', variant: 'success' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ show: true, message: 'Failed to add or update batch', variant: 'danger' });
    }
  };

  const handleInternFormSubmit = async (e) => {
    e.preventDefault();

    if (!internDetails.Name || !internDetails.Email || !internDetails.BatchID || !internDetails.College || !internDetails.Contact || !internDetails.City) {
      setAlert({ show: true, message: 'All fields are required', variant: 'danger' });
      return;
    }

    try {
      if (isUpdating && selectedIntern) {
        await axios.put(`http://localhost:3000/mentor_interns/${selectedIntern.id}`, internDetails);
        const updatedInterns = interns.map(intern =>
          intern.id === selectedIntern.id ? { ...intern, ...internDetails } : intern
        );
        setInterns(updatedInterns);
        setIsUpdating(false);
        setSelectedIntern(null);
        setInternDetails({ Name: '', Email: '', BatchID: '', College: '', Contact: '', City: '' });
        setShowInternForm(false);
        setAlert({ show: true, message: 'Intern updated successfully', variant: 'success' });
      } else {
        const response = await axios.post('http://localhost:3000/mentor_interns', internDetails);
        setInterns([...interns, response.data]);
        setInternDetails({ Name: '', Email: '', BatchID: '', College: '', Contact: '', City: '' });
        setShowInternForm(false);
        setAlert({ show: true, message: 'Intern added successfully', variant: 'success' });
      }
    } catch (error) {
      console.error('Error:', error);
      setAlert({ show: true, message: 'Failed to add or update intern', variant: 'danger' });
    }
  };

  const handleBatchDelete = async (batchId) => {
    try {
      await axios.delete(`http://localhost:3000/batch/${batchId}`);
      setBatches(batches.filter(batch => batch.id !== batchId));
      setAlert({ show: true, message: 'Batch deleted successfully', variant: 'success' });
    } catch (error) {
      console.error('Error deleting batch:', error);
      setAlert({ show: true, message: 'Failed to delete batch', variant: 'danger' });
    }
  };

  const handleInternDelete = async (internId) => {
    try {
      await axios.delete(`http://localhost:3000/mentor_interns/${internId}`);
      setInterns(interns.filter(intern => intern.id !== internId));
      setAlert({ show: true, message: 'Intern deleted successfully', variant: 'success' });
    } catch (error) {
      console.error('Error deleting intern:', error);
      setAlert({ show: true, message: 'Failed to delete intern', variant: 'danger' });
    }
  };

  const handleUpdateBatchClick = (batch) => {
    setBatchDetails(batch);
    setIsUpdating(true);
    setSelectedBatch(batch);
    setShowBatchForm(true);
  };

  const handleUpdateInternClick = (intern) => {
    setInternDetails(intern);
    setIsUpdating(true);
    setSelectedIntern(intern);
    setShowInternForm(true);
  };

  const handleCloseAlert = () => setAlert({ ...alert, show: false });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mentor-view">
      {alert.show && (
        <Toast
          onClose={handleCloseAlert}
          show={alert.show}
          delay={3000}
          autohide
          className="position-fixed bottom-0 end-0 m-3"
        >
          <Toast.Body>{alert.message}</Toast.Body>
        </Toast>
      )}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        id="mentor-view-tabs"
        className="mb-3"
      >
        <Tab eventKey="batches" title="Batches">
          <div className="batch-list">
            <h2>Batches</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Duration</th>
                  <th>Created On</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch, index) => (
                  <tr key={index}>
                    <td>{batch.Title}</td>
                    <td>{batch.Duration}</td>
                    <td>{formatDate(batch.Created_on)}</td>
                    <td>{batch.Description}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleUpdateBatchClick(batch)}>Update</Button>
                      <Button variant="danger" onClick={() => handleBatchDelete(batch.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="primary" onClick={() => setShowBatchForm(true)}>Add Batch</Button>
            {showBatchForm && (
              <Form onSubmit={handleBatchFormSubmit}>
                <Form.Group controlId="batchTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="Title"
                    value={batchDetails.Title}
                    onChange={handleBatchInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="batchDuration">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    name="Duration"
                    value={batchDetails.Duration}
                    onChange={handleBatchInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="batchCreatedOn">
                  <Form.Label>Created On</Form.Label>
                  <Form.Control
                    type="date"
                    name="Created_on"
                    value={batchDetails.Created_on}
                    onChange={handleBatchInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="batchDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="Description"
                    value={batchDetails.Description}
                    onChange={handleBatchInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  {isUpdating ? 'Update Batch' : 'Add Batch'}
                </Button>
                <Button variant="secondary" onClick={() => setShowBatchForm(false)}>Cancel</Button>
              </Form>
            )}
          </div>
        </Tab>
        <Tab eventKey="interns" title="Interns">
          <div className="intern-list">
            <h2>Interns</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Batch ID</th>
                  <th>College</th>
                  <th>Contact</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interns.map((intern, index) => (
                  <tr key={index}>
                    <td>{intern.Name}</td>
                    <td>{intern.Email}</td>
                    <td>{intern.BatchID}</td>
                    <td>{intern.College}</td>
                    <td>{intern.Contact}</td>
                    <td>{intern.City}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleUpdateInternClick(intern)}>Update</Button>
                      <Button variant="danger" onClick={() => handleInternDelete(intern.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="primary" onClick={() => setShowInternForm(true)}>Add Intern</Button>
            {showInternForm && (
              <Form onSubmit={handleInternFormSubmit}>
                <Form.Group controlId="internName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="Name"
                    value={internDetails.Name}
                    onChange={handleInternInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="internEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="Email"
                    value={internDetails.Email}
                    onChange={handleInternInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="internBatchID">
                  <Form.Label>Batch ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="BatchID"
                    value={internDetails.BatchID}
                    onChange={handleInternInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="internCollege">
                  <Form.Label>College</Form.Label>
                  <Form.Control
                    type="text"
                    name="College"
                    value={internDetails.College}
                    onChange={handleInternInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="internContact">
                  <Form.Label>Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="Contact"
                    value={internDetails.Contact}
                    onChange={handleInternInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="internCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="City"
                    value={internDetails.City}
                    onChange={handleInternInputChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  {isUpdating ? 'Update Intern' : 'Add Intern'}
                </Button>
                <Button variant="secondary" onClick={() => setShowInternForm(false)}>Cancel</Button>
              </Form>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default MentorView;
