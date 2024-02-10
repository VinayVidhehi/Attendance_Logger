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
  const courseId = "21CS53";
  const email = "vinayvidhehi@gmail.com";
  const counsellor = 1;
  const query = `
  SELECT course_name 
FROM course 
WHERE course_id = (SELECT course_id FROM staff WHERE staff_email = 'vinayvidhehi@gmail.com');

  `;

//   const values = [courseId, counsellor, email];
//   connection.query(
//     'select * from staff', values, (error, result) => {
//     if (error) {
//       console.log("Error: ", error.message);
//     } else {
//       console.log("Result: ", result);
//     }
//   });
// }

let id = 0;
connection.query(
  'desc course_attendance',
  (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
    }
  }
);
}

runQuery();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//0111111101011111111111101101111111110010111222222222222222222222222222
//CREATE TABLE staff ( staff_id int PRIMARY KEY, staff_name VARCHAR(100), staff_email varchar(100), course_id varchar(10), counsellor_number int);