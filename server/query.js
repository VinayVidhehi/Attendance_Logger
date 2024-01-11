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

function runQuery() {
  const dynamicSQL = `
    INSERT INTO course_attendance (id, course52, course53, date, day) VALUES (?, ?, ?, ?, ?);
  `;

  const values = [1, '0111111101011111111111101101111111110010111222222222222222222222222222', '2222222222222222222222222222222222222222222111101111001111101101111011', '2024-01-11', 'thursday'];

  connection.query('select * from course_attendance;', [61], (error, result) => {
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
