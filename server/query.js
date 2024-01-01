const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 7800;

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
// Define a sample route
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

function runQuery() {
    
  const dynamicSQL = `
  INSERT INTO students (id, usn, name, lab, email, counceller) 
  VALUES (60, '1RV21IS061', 'VINAY KUMAR D', 3, 'vinaykumard.is21@rvce.edu.in', 2);
`;
    connection.query(dynamicSQL, (error, result) => {
        if (error) {
            console.log("Error: ", error.message);
        } else {
            console.log("Result: ", result);
        }
    });
}


runQuery();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  