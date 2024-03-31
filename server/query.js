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
  host: "mysql-36e54173-mulberrydatabase.a.aivencloud.com",
  port: 24400,
  user: "avnadmin",
  password: "AVNS_PXPi8DwKVq_UOKMdt1m",
  database: "defaultdb",
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
  const courseId = '21AI52';
  const courseName = 'AI and ML';
  const staffName = 'Raghavendra Prasad S G'
  const credits = 4;
  const isLab = 1;
  const email = 'raghavendrap@rvce.edu.in';
  const query = `INSERT INTO students (student_id, student_name, student_email, usn, batch, staff_id)
  VALUES
      -- Batch 1
      (1, 'Akash', 'akash@example.com', '1RV21IS001', '1', '0'),
      (2, 'Bhavana', 'bhavana@example.com', '1RV21IS002', '1', '0'),
      (3, 'Chetan', 'chetan@example.com', '1RV21IS003', '1', '0'),
      (4, 'Deepika', 'deepika@example.com', '1RV21IS004', '1', '0'),
      (5, 'Esha', 'esha@example.com', '1RV21IS005', '1', '0'),
      (6, 'Farhan', 'farhan@example.com', '1RV21IS006', '1', '0'),
      (7, 'Gaurav', 'gaurav@example.com', '1RV21IS007', '1', '0'),
      (8, 'Hema', 'hema@example.com', '1RV21IS008', '1', '0'),
      (9, 'Ishaan', 'ishaan@example.com', '1RV21IS009', '1', '0'),
      (10, 'Jaya', 'jaya@example.com', '1RV21IS010', '1', '0'),
      (11, 'Kartik', 'kartik@example.com', '1RV21IS011', '1', '0'),
      (12, 'Lavanya', 'lavanya@example.com', '1RV21IS012', '1', '0'),
      (13, 'Manisha', 'manisha@example.com', '1RV21IS013', '1', '0'),
      (14, 'Neha', 'neha@example.com', '1RV21IS014', '1', '0'),
      (15, 'Omkar', 'omkar@example.com', '1RV21IS015', '1', '0'),
      (16, 'Pranav', 'pranav@example.com', '1RV21IS016', '1', '0'),
      (17, 'Qureshi', 'qureshi@example.com', '1RV21IS017', '1', '0'),
      (18, 'Rohini', 'rohini@example.com', '1RV21IS018', '1', '0'),
      (19, 'Sachin', 'sachin@example.com', '1RV21IS019', '1', '0'),
      (20, 'Tanvi', 'tanvi@example.com', '1RV21IS020', '1', '0'),
      (21, 'Uday', 'uday@example.com', '1RV21IS021', '1', '0'),
      (22, 'Varun', 'varun@example.com', '1RV21IS022', '1', '0'),
      (23, 'Wasiq', 'wasiq@example.com', '1RV21IS023', '1', '0'),
      -- Batch 2
      (24, 'Xavier', 'xavier@example.com', '1RV21IS024', '2', '1'),
      (25, 'Yash', 'yash@example.com', '1RV21IS025', '2', '1'),
      (26, 'Zara', 'zara@example.com', '1RV21IS026', '2', '1'),
      (27, 'Aryan', 'aryan@example.com', '1RV21IS027', '2', '1'),
      (28, 'Bina', 'bina@example.com', '1RV21IS028', '2', '1'),
      (29, 'Chirag', 'chirag@example.com', '1RV21IS029', '2', '1'),
      (30, 'Dhruv', 'dhruv@example.com', '1RV21IS030', '2', '1'),
      (31, 'Eva', 'eva@example.com', '1RV21IS031', '2', '1'),
      (32, 'Farah', 'farah@example.com', '1RV21IS032', '2', '1'),
      (33, 'Gita', 'gita@example.com', '1RV21IS033', '2', '1'),
      (34, 'Hitesh', 'hitesh@example.com', '1RV21IS034', '2', '1'),
      (35, 'Isha', 'isha@example.com', '1RV21IS035', '2', '1'),
      (36, 'Jatin', 'jatin@example.com', '1RV21IS036', '2', '1'),
      (37, 'Kavita', 'kavita@example.com', '1RV21IS037', '2', '1'),
      (38, 'Lakshya', 'lakshya@example.com', '1RV21IS038', '2', '1'),
      (39, 'Manav', 'manav@example.com', '1RV21IS039', '2', '1'),
      (40, 'Nehal', 'nehal@example.com', '1RV21IS040', '2', '1'),
      (41, 'Ojas', 'ojas@example.com', '1RV21IS041', '2', '1'),
      (42, 'Pooja', 'pooja@example.com', '1RV21IS042', '2', '1'),
      (43, 'Qadir', 'qadir@example.com', '1RV21IS043', '2', '1'),
      (44, 'Rahul', 'rahul@example.com', '1RV21IS044', '2', '1'),
      (45, 'Suman', 'suman@example.com', '1RV21IS045', '2', '1'),
      -- Batch 3
      (46, 'Tanmay', 'tanmay@example.com', '1RV21IS046', '3', '2'),
      (47, 'Uma', 'uma@example.com', '1RV21IS047', '3', '2'),
      (48, 'Varsha', 'varsha@example.com', '1RV21IS048', '3', '2'),
      (49, 'Waseem', 'waseem@example.com', '1RV21IS049', '3', '2'),
      (50, 'Xena', 'xena@example.com', '1RV21IS050', '3', '2'),
      (51, 'Yuvraj', 'yuvraj@example.com', '1RV21IS051', '3', '2'),
      (52, 'Zoya', 'zoya@example.com', '1RV21IS052', '3', '2'),
      (53, 'Arnav', 'arnav@example.com', '1RV21IS053', '3', '2'),
      (54, 'Babita', 'babita@example.com', '1RV21IS054', '3', '2'),
      (55, 'Vinay Kumar', 'vinaykumard.is21@rvce.edu.in', '1RV21IS055', '3', '1'),
      (56, 'Dinesh', 'dinesh@example.com', '1RV21IS056', '3', '2'),
      (57, 'Eshaan', 'eshaan@example.com', '1RV21IS057', '3', '2'),
      (58, 'Farida', 'farida@example.com', '1RV21IS058', '3', '2'),
      (59, 'Gopal', 'gopal@example.com', '1RV21IS059', '3', '2'),
      (60, 'Hari', 'hari@example.com', '1RV21IS060', '3', '2');
  
  `;
  const sub = "'21AI52'";

  connection.query(`select * from achievements

  `,[sub], (error, result) => {
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
