const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { handleUserLogin, handleUserSignup, attendanceUpdate, getStudentAttendance, getStaffAttendance, fetchLeaveRecord, handleCourseDetails,  handleFetchCourseDetails, checkCounsellor , handlePerformOCR, queryResult} = require('./router');

const app = express();
const PORT = 7800;

// Enable CORS
app.use(cors());
// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());

// MySQL Connection

// Change the route to /attendance
app.get('/attendance', attendanceUpdate);
app.get('/get-attendance', getStudentAttendance);
app.get('/attendance-staffview', getStaffAttendance);
app.get('/course-details', handleFetchCourseDetails);
app.get('/counsellor-check', checkCounsellor);
app.get('/leave-records', fetchLeaveRecord);


app.post('/signup', handleUserSignup);
app.post('/login', handleUserLogin);
app.post('/course-details', handleCourseDetails);
app.post('/perform-ocr', handlePerformOCR);
app.post('/query', queryResult);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//attendance-staff//leave-records