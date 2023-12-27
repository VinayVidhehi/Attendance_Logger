const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 7700;

// Enable CORS
app.use(cors());

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: 'mysql-36e54173-mulberrydatabase.a.aivencloud.com',
  port: 24400,
  user: 'avnadmin',
  password: 'AVNS_PXPi8DwKVq_UOKMdt1m',
  database: 'defaultdb',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Define the POST endpoint for ESP32 requests
app.post('/update-attendance', (req, res) => {
  // Extract the string containing USNs from the request payload
  const usnString = req.body.usnString;

  // Split the string into an array of USNs
  const usnArray = usnString.split(',');

  // Update the attendance table in the database
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format

  // Use a prepared statement to update the database
  const updateQuery = 'UPDATE attendance SET status = 1, date = ? WHERE usn = ?';

  usnArray.forEach((usn) => {
    connection.query(updateQuery, [currentDate, usn], (err, results) => {
      if (err) {
        console.error('Error updating attendance:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      console.log(`Attendance updated for USN: ${usn}`);
    });
  });

  res.status(200).send('Attendance updated successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
