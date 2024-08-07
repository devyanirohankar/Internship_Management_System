import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './db.js'; // Ensure you include the correct path to your db.js file

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Internship Management System API');
});

// Route to get all interns
app.get('/interns', (req, res) => {
  db.query('SELECT id, Name, Email, City, College, Contact FROM intern', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Route to add a new intern
app.post('/interns', (req, res) => {
  const { Name, Email, City, College, Contact } = req.body;

  // Validation
  if (!Name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const query = 'INSERT INTO intern (Name, Email, City, College, Contact) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [Name, Email, City, College, Contact], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newInternId = results.insertId;
    db.query('SELECT id, Name, Email, City, College, Contact FROM intern WHERE id = ?', [newInternId], (err, newIntern) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json(newIntern[0]);
    });
  });
});

// Route to get data for a single intern by ID
app.get('/interns/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT id, Name, Email, City, College, Contact FROM intern WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    res.status(200).json(results[0]);
  });
});

// Route to delete an intern by ID
app.delete('/interns/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM intern WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    res.status(200).json({ message: 'Intern deleted successfully' });
  });
});

// Route to update an intern by ID
app.put('/interns/:id', (req, res) => {
  const { id } = req.params;
  const { Name, Email, City, College, Contact } = req.body;
  const query = 'UPDATE intern SET Name = ?, Email = ?, City = ?, College = ?, Contact = ? WHERE id = ?';
  db.query(query, [Name, Email, City, College, Contact, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    res.status(200).json({ message: 'Intern updated successfully' });
  });
});

let batches = [];
let interns = [];

// Route to get all batch
app.get('/batch', (req, res) => {
  db.query('SELECT id, Title, Duration, Created_on, Description FROM batch', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Route to add a new batch
app.post('/batch', (req, res) => {
  const { Title, Duration, Created_on, Description } = req.body;

  if (!Title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const query = 'INSERT INTO batch (Title, Duration, Created_on, Description) VALUES (?, ?, ?, ?)';
  db.query(query, [Title, Duration, Created_on, Description], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newBatch = { id: results.insertId, Title, Duration, Created_on, Description }; // Construct the new batch object
    res.status(201).json(newBatch);
  });
});

// Route to update a batch by ID
app.put('/batch/:id', (req, res) => {
  const { id } = req.params;
  const { Title, Duration, Created_on, Description } = req.body;
  const query = 'UPDATE batch SET Title = ?, Duration = ?, Created_on = ?, Description = ? WHERE id = ?';
  db.query(query, [Title, Duration, Created_on, Description, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json({ message: 'Batch updated successfully' });
  });
});

// Route to delete an batch by ID
app.delete('/batch/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM batch WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json({ message: 'Batch deleted successfully' });
  });
});

// Route to get all mentor_interns (interns)
app.get('/mentor_interns', (req, res) => {
  db.query('SELECT id, Name, Email, BatchID, College, Contact, City FROM mentor_intern', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// Route to add a new intern
app.post('/mentor_interns', (req, res) => {
  const { Name, Email, BatchID, College, Contact, City } = req.body;

  // Validation
  if (!Name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const query = 'INSERT INTO mentor_intern (Name, Email, BatchID, College, Contact, City) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [Name, Email, BatchID, College, Contact, City], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Intern added successfully', mentor_internId: results.insertId });
  });

  const newIntern = { id: interns.length + 1, Name, Email, BatchID, College, Contact, City };
  interns.push(newIntern);
  res.status(201).json(newIntern);
});

// Route to update an intern by ID
app.put('/mentor_interns/:id', (req, res) => {
  const { id } = req.params;
  const { Name, Email, BatchID, College, Contact, City } = req.body;
  const query = 'UPDATE mentor_intern SET Name = ?, Email = ?, BatchID = ?, College = ?, Contact = ?, City = ?  WHERE id = ?';
  db.query(query, [Name, Email, BatchID, College, Contact, City, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    res.status(200).json({ message: 'Intern updated successfully' });
  });
});

// Route to delete an intern by ID

app.delete('/mentor_interns/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM mentor_intern WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Intern not found' });
    }
    res.status(200).json({ message: 'Intern deleted successfully' });
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
