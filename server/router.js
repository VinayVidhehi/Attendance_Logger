const mongoose = require("mongoose");
const User = require("./models/user_schema");
const OTPModel = require("./models/otp_schema");
const nodemailer = require("nodemailer");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const connection = mysql.createConnection({
  host: "attendance-logger-spoorthivarumbudi-ddc7.a.aivencloud.com",
  port: 12226,
  user: "avnadmin",
  password: "AVNS_aRs9_9YVW7p-mEzvwzx",
  database: "defaultdb",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
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
    const { email, key } = req.body;

    if (!email) {
      throw new Error("Email is required");
    }

    if (key == 1) {
      const user = await User.findOne({ email });
      const otp = await OTPModel.findOne({ email });
      if (otp) {
        await OTPModel.findOneAndDelete({ email });
      }
      if (user) {
        // If user already exists, send a response indicating that
        return res.send({
          message: "User already exists. Please sign in instead",
          key: 0,
        });
      }

      const generatedOTP = generateOTP();
      await OTPModel.create({ email, otp: generatedOTP });
      await sendOTPEmail(email, generatedOTP);

      return res
        .status(200)
        .send({ message: "OTP sent to your email successfully", key: 1 });
    } else if (key == 2) {
      const { email, Name, counsellorNumber, OTP, password, usn, batch } =
        req.body;

      // Handle user registration and OTP validation
      if (!OTP) {
        throw new Error("OTP is required");
      }

      // Find the OTP in MongoDB
      const foundOTP = await OTPModel.findOne({ email });

      if (!foundOTP || JSON.stringify(foundOTP.otp) !== OTP) {
        throw new Error("Entered OTP doesn't match. Try again later.");
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
        email,
        password: hashedPassword,
        isStaff: false,
        isCounsellor: false,
      });
      // save all the incoming variables related to the user to students table in MySQL
      await newUser.save();

      const id = parseInt(usn.substring(usn.length - 3), 10);
      const query =
        "insert into students(id, name, usn, email, lab, counsellor) values (?, ?, ?, ?, ?, ?)";
      const values = [id, Name, usn, email, batch, counsellorNumber];

      connection.query(query, values, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      });

      // Complete this to save users in students table;
      await OTPModel.findOneAndDelete({ email });
      res.status(200).send({ message: "User saved successfully", key: 1 });
    } else {
      const { Name, password, OTP, email } = req.body;

      if (!OTP) {
        throw new Error("OTP is required");
      }

      // Find the OTP in MongoDB
      const foundOTP = await OTPModel.findOne({ email });

      console.log(
        "OTP is ",
        foundOTP,
        OTP,
        " also their types are",
        typeof foundOTP,
        typeof OTP
      );
      if (!foundOTP || JSON.stringify(foundOTP.otp) !== OTP) {
        return res.send({
          message: "entered OTP doesnt match, try again",
          key: 2,
        });
      }

     connection.query('select count(*) as count from staff', (countError, count) => {
      if(countError) console.log("error while counting");
      else {
        console.log(count[0].count);
        const query =
        "insert into staff(staff_id, staff_name, staff_email) values (?, ?, ?)";
      const values = [count[0].count, Name, email];

      connection.query(query, values, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      });
      }
     })

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, saltRounds);

     const newUser = new User({
      email,
      password: hashedPassword,
      isStaff: true,
      isCounsellor: false,
    });
    // save all the incoming variables related to the user to students table in MySQL
    await newUser.save();

      // Complete this to save users in students table;
      await OTPModel.findOneAndDelete({ email });
      res.status(200).send({ message: "User saved successfully", key: 1 });
    }
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).send({ message: error.message, key: 0 });
  }
};

const attendanceUpdate = async (req, res) => {
  console.log("Ids of students who are present are ", req.query);

  // Save the attendance string to the database
  const attendanceString = req.query.id;
  const courseId = req.query.courseId;
  const currentDate = new Date().toISOString().split("T")[0];

  // Get the current day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  const currentDay = new Date().getDay();

  // Split the incoming comma-separated string into an array of IDs
  const incomingIDs = attendanceString.split(",").map(Number);

  let studentStrength;
  connection.query(
    "select count(student_email) as count from students",
    (error, result) => {
      if (error) console.log("error at student strength", error);
      else {
        console.log(result[0].count);
        studentStrength = result;
      }
    }
  );
  // Create an array to store the attendance status (0 or 1) for each ID
  const status = Array(studentStrength).fill(2);

  // Loop through the incoming IDs and set the corresponding status to 1
  incomingIDs.forEach((id) => {
    // Check if the ID is within the valid range (0 to 69)
    //if (id > 0 && id < studentStrength) {
    status[id] = 1;
    // }
  });

  //query to select the maximum batch value so that the loop runs only that number of times
  connection.query(
    "select max(batch) as range from students",
    (error, result) => {
      if (error) console.log("error in fetching highest lab value", error);
      else {
        console.log(range);
        for (let i = 0; i < range; i++) {
          //here the status array will have the array values of 2s and 1s but which tells that the class is not taken or student is present respectively, but when you find first 1, all the students who belong to that same batch will have lab so those students who belong to the same batch as the first present student in the array (1) should be marked 0 because they are absent, also there should a variable which marks the end of students of those particaular batch so that the next time it finds 1 should not be from the same batch as the older batch)
        }
      }
    }
  );

  // Convert the status array to a string
  const statusString = status.join("");
  console.log("status string now is", statusString);

  // Assuming you have a table named courseId_attendance with columns 'date', 'day', 'courseId', and 'status'
  // const query =
  //   "INSERT INTO course_attendance (date, day, course_id, attendance) VALUES (?, ?, ?, ?)";

  // connection.query(
  //   query,
  //   [currentDate, currentDay, courseId, statusString],
  //   (err, results) => {
  //     if (err) {
  //       console.error("Error saving attendance to database:", err.message);
  //     } else {
  //       console.log("Attendance saved to database.", results);
  //     }
  //   }
  // );

  res.json({ message: "Hello, this is your Express server with CORS!\n" });
};

const getAttendance = async (req, res) => {
  const email = req.query.email;

  // Adjust the query to filter by courseId
  const query = `SELECT * FROM course_attendance;`;

  connection.query(query, async (err, results) => {
    if (err) {
      console.error("Error fetching attendance from database:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Attendance fetched from database:", results);

      // Query the students table to get the id based on the provided email
      const studentsQuery =
        "SELECT student_id, student_name FROM students WHERE student_email = ?";

      connection.query(
        studentsQuery,
        [email],
        (studentsErr, studentsResults) => {
          if (studentsErr) {
            console.error(
              "Error fetching student ID from database:",
              studentsErr.message
            );
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("Student ID fetched from database:", studentsResults);
            const studentID =
              studentsResults.length > 0 ? studentsResults[0].id : null;

            console.log("result is ", studentsResults);
            // Process attendance data to calculate attendance status and percentage
            // const attendanceData = results.map((entry) => {
            //   const totalDays = Object.keys(entry).filter((key) =>
            //     key.startsWith("courseId")
            //   ).length;
            //   let presentDays = 0;

            //   console.log("entry is ", entry[2]);
            //   for (let i = 52; i <= 53; i++) {
            //     const statusChar = entry[`course${i}`][studentID - 1];
            //     const statusBool = statusChar === "1";

            //     if (statusBool) {
            //       presentDays++;
            //     }
            //   }

            //   const attendancePercentage = (presentDays / totalDays) * 100;

            //   return {
            //     date: entry.date,
            //     status: attendancePercentage >= 75, // Assuming 75% as the threshold for 'Present'
            //     key: studentID > 43 ? 2 : 1,
            //     attendancePercentage: attendancePercentage.toFixed(2),
            //   };
            // });

            // console.log(attendanceData);
            // // Prepare the final response object
            // const responseWithStudentID = {
            //   attendance: attendanceData,
            //   studentID: studentID,
            //   name: studentsResults[0].name,
            // };

            // res.json(responseWithStudentID);
          }
        }
      );
    }
  });
};

const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log("user,", user);
    if (user == null) {
      // User not found
      res.send({ key: 0, message: "User not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Passwords match, user found
      if (user.isCounsellor) res.send({ key: 3, message: "User found" });
      else if (user.isStaff) res.send({ key: 2, message: "User found" });
      else res.send({ key: 1, message: "User found" });
    } else {
      // Passwords do not match
      res.send({ key: 4, message: "Incorrect password" });
    }
  } catch (error) {
    console.log("Error while searching for user:", error.message);
    res.status(500).send({ key: 0, message: "Internal Server Error" });
  }
};

const getStaffAttendance = async (req, res) => {
  const { email } = req.query;

  connection.query(
    "SELECT course_id FROM staff WHERE staff_email = ?",
    [email],
    (error, courseIdId) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("courseId found is ", courseIdId);
        const courseId = "course";
        const finalCourseId = courseId.concat(courseIdId[0].course_id);
        console.log(finalCourseId, typeof finalCourseId);
        const query = `SELECT ${finalCourseId}, date FROM course_attendance;`;

        connection.query(query, async (err, results) => {
          if (err) {
            console.error(
              "Error fetching attendance from database:",
              err.message
            );
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("Attendance fetched from database:", results);

            // Query the students table to get the id and name of all students
            const studentsQuery = "SELECT id, name FROM students;";

            connection.query(studentsQuery, (studentsErr, studentsResults) => {
              if (studentsErr) {
                console.error(
                  "Error fetching student data from database:",
                  studentsErr.message
                );
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                console.log(
                  "Student data fetched from database:",
                  studentsResults
                );
                res.status(200).json({
                  key: 1,
                  attendance: results,
                  students: studentsResults,
                });
              }
            });
          }
        });
      }
    }
  );
};

const getStatusText = (status) => {
  switch (status) {
    case "0":
      return "Absent";
    case "1":
      return "Present";
    case "2":
      return "Class Not Taken";
    default:
      return "Unknown Status";
  }
};

const handleCourseDetails = async (req, res) => {
  const { email, isLab, courseId, counsellor, courseName, credits } = req.body;

  const query = `
    UPDATE staff
    SET 
      course_id = ?,
      counsellor_number = ?
    WHERE
      staff_email = ?
  `;

  const values = [courseId, counsellor, email];
  console.log("credentials are", req.body);
  connection.query(query, values, async (error, results) => {
    if (error) {
      console.error("Error updating staff details:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Staff details updated successfully:", results);

      // Update isCounsellor in MongoDB User collection if counsellor value is not 0
      if (counsellor !== 0) {
        try {
          const mongoresponse = await User.updateOne({ email }, { $set: { isCounsellor: true } });
          console.log("User updated as Counsellor in MongoDB", mongoresponse);
        } catch (err) {
          console.error("Error updating User as Counsellor in MongoDB:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      }

      const courseQuery =
        "INSERT INTO course(course_id, course_name, credits, isLab) VALUES (?, ?, ?, ?);";
      const queryValues = [courseId, courseName, credits, isLab];

      connection.query(
        courseQuery,
        queryValues,
        (courseError, courseResults) => {
          if (courseError) {
            console.error("Error updating course details:", courseError);
            return res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("Course details updated successfully:", courseResults);
            return res
              .status(200)
              .json({ message: "Staff details updated successfully", key:1 });
          }
        }
      );
    }
  });
};

const handleFetchCourseDetails = async (req, res) => {
  const { key } = req.query;
  console.log("what is the key", key, req.query);

  if (key == 1) {
    try {
      console.log("am i here");
      const { email } = req.query;
      const query = `SELECT course_name 
      FROM course 
      WHERE course_id = (SELECT course_id FROM staff WHERE staff_email = ?)`;
      //see whether there is course details in the course table where email = email, send key in the res as 1 if its there and 0 if not
      connection.query(query, [email], (error, result) => {
        console.log("results", result);
        if (error) {
          console.log(error);
        } else if (result.length > 0) {
          console.log("results", result);
          connection.query('select count(*) as count from staff where counsellor_number NOT like 0', (error, counsellorNumberResult) => {
            if(error) console.log("error while knowing the number of counsellors ", error);
            else {
              console.log(counsellorNumberResult);
            }
          })
          res.status(200).json({ message: "fetch successful", key: 1 });
        } else {
          console.log("results", result);
          res.status(200).json({ message: "fetch successful", key: 0 });
        }
      });
    } catch (error) {
      console.log(error, "this is the error");
    }
  } else if (key == 0) {
    //console.log("am i here")
    try {
      // Query to fetch staff details
      const staffQuery = "SELECT staff_name as counsellor FROM staff where counsellor_number not like 0";
      connection.query(staffQuery, (staffError, staffResults) => {
        if (staffError) {
          console.error("Error fetching staff details:", staffError);
          return res.status(500).json({ error: "Internal Server Error" });
        } else {
          // Query to fetch course details
          const staffDetails = staffResults;
          return res.status(200).json({ staffDetails });
        }
      });
    } catch (error) {
      console.error("Error during fetch course details:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = {
  handleUserLogin,
  handleFetchCourseDetails,
  handleUserSignup,
  attendanceUpdate,
  getAttendance,
  getStaffAttendance,
  handleCourseDetails,
};

/*
hashing passwords
attendance percentage column
make teachers to login with some code, so that they can see everybody's attendance
bring the whole attendance to frontend and add filter option 
*/
/*
change counceller attribute
*/
