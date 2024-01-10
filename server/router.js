const mongoose = require("mongoose");
const User = require("./models/user_schema");
const nodemailer = require("nodemailer");
const mysql = require('mysql2');

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


(async () => {
  try {
    await mongoose
      .connect(
        "mongodb+srv://vinayvidhehi:TCWxRz3FVPro6DKM@ams.uaepwlv.mongodb.net/"
      )
      .then(() => console.log("connection successfull"));
  } catch (error) {
    console.error("Connection error:", error.message);
  }
})();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vinayvidhehi@gmail.com",
    pass: "avgo zstp olwh kppr ",
  },
});
//chrg qkgp cbmi jxgf
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const usersWithOTP = [];

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: "vinayvidhehi@gmail.com",
    to: email,
    subject: "OTP verification for AMS",
    text: `Your one-time password for signing up for AMS is ${otp}. Please do not share this with anyone`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Unable to send OTP, try again later");
  }
};

const handleUserSignup = async (req, res) => {
  try {
    const {email, key } = req.body;

    if (!email) {
      throw new Error("email is required");
    }

    if (key) {
      // Handle OTP generation and email sending
      const generatedOTP = generateOTP();

      usersWithOTP.unshift({ email, OTP: generatedOTP });
      console.log("User with OTP initially:", usersWithOTP);

      await sendOTPEmail(email, generatedOTP);
     ////////changes here /////////////////////
      res
        .status(200)
        .send({ message: "OTP sent to your email successfully", key: 1 });
    } else {
      const { email, Name, Counsellor, OTP, password, usn, batch } = req.body;
      console.log(
        "details after otp is sent is ",
          email,
          password,
          usn,
          OTP,
          Name, 
          batch,
          Counsellor,
      );
      // Handle user registration and OTP validation
      if (!OTP) {
        throw new Error("OTP is required");
      }

      const index = usersWithOTP.findIndex(
        (user) => user.email === email
      );

      const foundUser = usersWithOTP[index];
      const otp = JSON.stringify(foundUser.OTP);
      //console.log("type of founduser otp is ", typeof(otp), "type of otp is ", typeof(OTP))
      if (!foundUser || otp !== OTP) {
        usersWithOTP.splice(index, 1);
        throw new Error("Entered OTP doesn't match. Try again later.");
      }

      const newUser = new User({ email, password, usn });
      // save all the incoming variables related to the user to students table in mysql
      await newUser.save();
      
      const id = parseInt(usn.substring(usn.length - 3), 10);
      const query = 'insert into students(id, name, usn, email, lab, counsellor) values (?, ?, ?, ?, ?, ?)';
      const values = [id, Name, usn, email, batch, Counsellor];

      connection.query(query, values, (error, result) => {
        if(error) {
          console.log(error);
        }else {
          console.log(result);
        }
      })
      //complete this to save users in students table;
      usersWithOTP.splice(index, 1);
      res.status(200).send({ message: "User saved successfully", key: 1 });
    }
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).send({ message: error.message, key: 0 });
  }
};

const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const response = await User.findOne({ email});
    console.log("user is", response);
    if (response.password === password) {
      res.send({ message: "user found", key: 1, response });
    } else {
      res.send({ message: "user not found", key: 0 });
    }
  } catch (error) {
    console.log(
      "error while searching for user, try again later",
      error.message
    );
  }
};

const attendanceUpdate = async (req, res) => {
  console.log("Ids of students who are present are ", req.query.id);

  // Save the attendance string to the database
  const attendanceString = req.query.id;
  saveAttendanceToDB(attendanceString);

  res.json({ message: 'Hello, this is your Express server with CORS!\n' });
}

// Function to save the attendance string to the database
function saveAttendanceToDB(attendanceString) {
  // Get the current date in 'YYYY-MM-DD' format
  const currentDate = new Date().toISOString().split('T')[0];

  // Split the incoming comma-separated string into an array of IDs
  const incomingIDs = attendanceString.split(',').map(Number);

  // Create an array to store the attendance status (0 or 1) for each ID
  const status = Array(70).fill(0);

  // Loop through the incoming IDs and set the corresponding status to 1
  incomingIDs.forEach((id) => {
    // Check if the ID is within the valid range (0 to 69)
    if (id > 0 && id < 80) {
      status[id-1] = 1;
    }
  });

  // Convert the status array to a string
  const statusString = status.join('');
  console.log("status string now is",statusString);

  // Assuming you have a table named DBS_Lab_eg with columns 'date' and 'status'
  const query = 'INSERT INTO DBS_Lab (date, status) VALUES (?, ?)';

  connection.query(query, [currentDate, statusString], (err, results) => {
    if (err) {
      console.error('Error saving attendance to database:', err.message);
    } else {
      console.log('Attendance saved to database.', results);
    }
  });
}

const getAttendance = async (req, res) => {
  const email = req.query.email;
  console.log("email ssss", email);
  // Adjust the query to filter by course
  const query = `SELECT * FROM DBS_Lab_eg;`;

  connection.query(query, async (err, results) => {
    if (err) {
      console.error('Error fetching attendance from database:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log('Attendance fetched from database:', results);

      // Query the students table to get the id based on the provided email
      const studentsQuery = 'SELECT id, name FROM students WHERE email = ?';

      connection.query(studentsQuery, [email], (studentsErr, studentsResults) => {
        if (studentsErr) {
          console.error('Error fetching student ID from database:', studentsErr.message);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          console.log('Student ID fetched from database:', studentsResults);
          const studentID = studentsResults.length > 0 ? studentsResults[0].id : null;
      
          // Initialize idthvalue as an empty array
          let idthvalue = [];
      
          // Process attendance data to calculate attendance status
          const attendanceData = results.map((entry) => {
            const statusChar = entry.status[studentID-1];
            const statusBool = statusChar === '1';
      
            return {
              date: entry.date,
              status: statusBool,
            };
          });
      
      
          // Prepare the final response object
          const responseWithStudentID = {
            attendance: attendanceData,
            studentID: studentID,
            name: studentsResults[0].name,
          };
      
          res.json(responseWithStudentID);
        }
      });
      
    }
  });
};


module.exports = {
  handleUserLogin,
  handleUserSignup,
  attendanceUpdate,
  getAttendance,
};
/*
add two tables into one
also make the status variable contain another variable 2, so that it will not display attendance on that particular date
make teachers to login with some code, so that they can see everybody's attendance
bring the whole attendance to frontend and add filter option 
*/ 