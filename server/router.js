const mongoose = require("mongoose");
const User = require("./models/user_schema");
const OTPModel = require("./models/otp_schema");
const nodemailer = require("nodemailer");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const axios = require("axios");

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
        console.log("i should be here");
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
      const { email, Name, Counsellor, OTP, password, usn, batch } = req.body;

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
      connection.query(
        "select staff_id from staff where staff_name = ?",
        [Counsellor],
        async (error, results) => {
          if (error)
            console.log("error while finding staff_id from staff_name", error);
          else {
            console.log("staff_id that was retrieved was ", results);
            const query =
              "insert into students(student_id, student_name, usn, student_email, batch, staff_id) values (?, ?, ?, ?, ?, ?)";
            const values = [id, Name, usn, email, batch, results[0].staff_id];

            connection.query(query, values, (error, result) => {
              if (error) {
                console.log(error);
              } else {
                console.log(result);
              }
            });

            // Complete this to save users in students table;
            await OTPModel.findOneAndDelete({ email });
            res
              .status(200)
              .send({ message: "User saved successfully", key: 1 });
          }
        }
      );
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

      const query =
        "insert into staff( staff_name, staff_email) values ( ?, ?)";
      const values = [Name, email];

      connection.query(query, values, (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log(result);
        }
      });

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

  // Get the current day name (e.g., "Sunday", "Monday")
  const options = { weekday: "long" };
  const currentDay = new Date().toLocaleDateString("en-US", options);

  // Split the incoming comma-separated string into an array of IDs
  const incomingIDs = attendanceString.split(",").map(Number);

  try {
    // Fetch student strength
    const studentStrength = await getStudentStrength();
    console.log("Number of students are ", studentStrength);

    // Initialize status array with 2s
    const status = Array(studentStrength).fill(2);

    incomingIDs.map((id) => {
      status[id] = 1;
    });

    // Process batches
    let count = 1;
    while (count < studentStrength) {
      console.log("here status isss like this ", status, incomingIDs);
      console.log("count now is ", count);
      const batchResult = await processBatchQuery(
        count,
        status,
        studentStrength
      );
      console.log(batchResult);
      if (batchResult != 1) {
        batchResult.forEach((ids) => {
          if (status[ids.id] == 2) status[ids.id] = 0;
          count = ids.id;
          console.log("count is changing and is changing to", count);
        });
      }
      count++;
    }

    // Convert the status array to a string
    const statusString = status.join("");
    console.log(
      "Status string now is",
      statusString,
      " and status array is this ",
      status
    );

    // const updateAttendance = await attendanceUpdateHandler(
    //   currentDate,
    //   currentDay,
    //   courseId,
    //   statusString
    // );
    // console.log("status of updated attendance", updateAttendance);

    // res.json({ message: "Hello, this is your Express server with CORS!\n" });
    res.json({ message: "Hello, this is your Express server with CORS!\n" });
  } catch (error) {
    console.error("Error in attendanceUpdate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get student strength
const attendanceUpdateHandler = (date, day, course, attendance) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `insert into course_attendance (date, day, course_id, attendance) values (?,?,?,?)`,
      [date, day, course, attendance],
      (error, result) => {
        if (error) {
          console.log("error while uploding attendance", error);
          reject(error);
        } else resolve(result);
      }
    );
  });
};

const getStudentStrength = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT COUNT(student_email) AS count FROM students",
      (error, result) => {
        if (error) {
          console.log("Error at student strength", error);
          reject(error);
        } else {
          resolve(result[0].count + 1);
        }
      }
    );
  });
};

// Function to process batch query
const processBatchQuery = (count, status, studentStrength) => {
  return new Promise((resolve, reject) => {
    const checkUndefined = findFirstIndex(count, status, studentStrength);
    if (checkUndefined != undefined) {
      console.log("Am I here?");

      connection.query(
        `SELECT student_id AS id FROM students WHERE batch = (SELECT batch FROM students WHERE student_id = ${checkUndefined})`,
        (error, batchResult) => {
          if (error) {
            console.log(
              "Error while finding and marking them absent in attendance",
              error
            );
            reject(error);
          } else {
            resolve(batchResult);
          }
        }
      );
    } else {
      const key = 1;
      resolve(key);
    }
  });
};

// Function to find first index
const findFirstIndex = (count, status, studentStrength) => {
  let index = count;
  console.log("am i here", count, status, studentStrength);
  while (index < studentStrength - 1) {
    if (status[index] == 1) {
      console.log("Returning index", index);
      return index;
    } else {
      console.log("index increasing to", index++);
      index++;
    }
  }
};

const getStudentAttendance = async (req, res) => {
  const email = req.query.email;
  console.log("here i am");
  connection.query("select * from course_attendance", (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);

      connection.query(
        "select student_id as id, student_name as name from students where student_email=?",
        [email],
        (error, studentId) => {
          if (error) {
            console.log(error);
          } else {
            const attendance = [];
            console.log("student id is", studentId);
            results.forEach((eachDay) => {
              const checkPresence = eachDay.attendance[studentId[0].id];
              if (checkPresence == 0) {
                const status = "absent";
                const date = eachDay.date;
                attendance.push({ date, status, course: eachDay.course_id });
              } else if (checkPresence == 1) {
                const status = "present";
                const date = eachDay.date;
                attendance.push({ date, status, course: eachDay.course_id });
              } else if (checkPresence == 2) {
                const status = "No Lab taken";
                const date = eachDay.date;
                attendance.push({ date, status, course: eachDay.course_id });
              }
            });

            console.log(
              "Attendance for student with email",
              email,
              ":",
              attendance
            );
            res.json({
              message: "succesfully fetched attendance",
              attendance,
              name: studentId[0].name,
            });
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
    (error, courseId) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        console.log("courseId found is ", courseId);

        const course = `'${courseId[0].course_id}'`;
        console.log("god is ", course);
        connection.query(
          `select attendance, date from course_attendance where course_id = ?`,
          [course],
          (error, attendanceString) => {
            if (error)
              console.log("error while fetching attendance string", error);
            else {
              console.log("here is the attendance", attendanceString);
              connection.query(
                "select student_id, student_name from students",
                (error, students) => {
                  if (error)
                    console.log(
                      "error while fetching students data for attendance",
                      error
                    );
                  else {
                    const staffAttendance = {
                      students,
                      attendanceString,
                    };
                    console.log(
                      "hurray students data sent succesfully",
                      staffAttendance
                    );
                    res.json({
                      message: "hurray",
                      attendance: staffAttendance,
                      key: 1,
                    });
                  }
                }
              );
            }
          }
        );
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
          const mongoresponse = await User.updateOne(
            { email },
            { $set: { isCounsellor: true } }
          );
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
              .json({ message: "Staff details updated successfully", key: 1 });
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
          connection.query(
            "select count(*) as count from staff where counsellor_number NOT like 0",
            (error, counsellorNumberResult) => {
              if (error)
                console.log(
                  "error while knowing the number of counsellors ",
                  error
                );
              else {
                console.log(counsellorNumberResult);
              }
            }
          );
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
      const staffQuery =
        "SELECT staff_name as counsellor, staff_id as id FROM staff where counsellor_number not like 0";
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

const checkCounsellor = async (req, res) => {
  const { email } = req.query;
  const response = await User.findOne({ email });
  if (response.isCounsellor == true) {
    res.json({ message: "counsellor", key: 1 });
  } else {
    res.json({ message: "not a counsellor", key: 0 });
  }
};

const handlePerformOCR = async (req, res) => {
  const { details } = req.body;
  const { email, fromDate, toDate, reason } = details;

  console.log("ocr text is ", reason);
  try {
    // Make a POST request to the Flask server endpoint
    const flaskResponse = await axios.post(
      "http://127.0.0.1:5000/generate_record",
      {
        ocr_text: reason,
        email: email,
      }
    );

    // Handle Flask server response
    console.log("Flask server response:", flaskResponse.data);
    res.json({ message: "Successfully logged values", key: 1 });
  } catch (error) {
    console.error("Error while sending data to Flask server:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchLeaveRecord = async (req, res) => {
  const { email } = req.query;

  try {
    // Access the default MongoDB connection established by Mongoose
    const db = mongoose.connection.db;
    const collection = db.collection("certificates"); // Replace with your collection name

    // Query the collection for records with the specified email
    const records = await collection.find({ student_email: email }).toArray();

    // Send the records as response
    res.json({ message: "Successfully fetched", records });
  } catch (error) {
    console.error("Error while fetching leave records:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  fetchLeaveRecord,
  handleUserLogin,
  handleFetchCourseDetails,
  handleUserSignup,
  attendanceUpdate,
  getStudentAttendance,
  getStaffAttendance,
  checkCounsellor,
  handleCourseDetails,
  handlePerformOCR,
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
