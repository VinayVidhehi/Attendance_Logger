const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 7900;

// Enable CORS
app.use(cors());

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: 'attendance-logger-spoorthivarumbudi-ddc7.a.aivencloud.com',
  port: 12226,
  user: 'avnadmin',
  password: 'AVNS_aRs9_9YVW7p-mEzvwzx',
  database: 'defaultdb',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Define a route handler
app.get('/deleteCourse', (req, res) => {
  const query = `delete from students
  `
  connection.query(query, (error, result) => {
    if (error) {
      console.log("Error deleting records:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Records deleted successfully:", result);
      res.status(200).json({ message: "Records deleted successfully" });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
