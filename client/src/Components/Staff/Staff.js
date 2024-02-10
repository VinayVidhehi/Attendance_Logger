import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Staff = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [students, setStudents] = useState([]);
  const [isLab, setIsLab] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [counsellor, setCounsellor] = useState(0);
  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState(1);
  const [check, setCheck] = useState(true);

  const location = useLocation();
  const email = location.state.email;
  console.log("email is ",email);

  useEffect(() => {
    courseData();
    //fetchAttendanceData();
  }, [email]);

  const courseData = async() => {
    const response = await axios.get(`http://localhost:7800/course-details?email=${email}&key=1`);
    if(response.data.key === 1) setCheck(false);
    else console.log("nahhh fill details bruh");
  }

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7800/attendance-staffview?email=${email}`
      );

      response.data.attendance.map((e, ind) => console.log(e.date));

      if (response.data.key === 1) {
        setAttendanceData(response.data.attendance);
        setStudents(response.data.students);
      } else {
        console.log(
          "Invalid response structure or key value:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error fetching attendance staff view:", error.message);
    }
  };

  const handleCourseDetails = async () => {
    try {
      const response = await axios.post("http://localhost:7800/course-details", {
        email,
        isLab,
        courseId,
        counsellor,
        courseName,
        credits
      });
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error updating course details:", error.message);
    }
  };

  return (
    <div>
      <div>
        <h2>Welcome to AMS</h2>
        {check && <div>
          <h3>Update course details here</h3>
        <form onSubmit={handleCourseDetails}>
          <div>
            <label>Does this course contains Laboratory?</label>
            <input
              type="checkbox"
              checked={isLab}
              onChange={(e) => setIsLab(e.target.checked)}
            />
          </div>
          <div>
            <label>Enter the course ID</label>
            <input
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            />
          </div>
          <div>
            <label>Course Name:</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
          </div>
          <div>
            <label>Are you a counsellor, if yes then enter the batch for which you are a counsellor for. If not then let that be zero</label>
            <input
              type="number"
              value={counsellor}
              onChange={(e) => setCounsellor(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label>total number of credits this course holds is</label>
            <input
              type="number"
              value={credits}
              onChange={(e) => setCredits(parseInt(e.target.value))}
            />
          </div>
          <button type="submit">Update Course Details</button>
        </form>
        </div> }
      </div> 
    </div>
  );
};

export default Staff;
