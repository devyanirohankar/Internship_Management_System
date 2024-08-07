// db.js
import mysql from 'mysql';

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '',
  database: 'internship' 
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as id ' + connection.threadId);
});

export default connection;
