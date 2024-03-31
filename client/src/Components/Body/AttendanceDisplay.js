import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendanceDisplay.css'; // Import the CSS file

const AttendanceDisplay = (props) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [name, setName] = useState("user");
  const [selectedCourse, setSelectedCourse] = useState('All'); // Initialize with 'All' as default
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    // Fetch attendance data when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7800/get-attendance', {
          params: {
            email: props.email,
          },
        });
        console.log(response.data.attendance);
        setAttendanceData(response.data.attendance); // Extract the attendance array
        setName(response.data.name)
      } catch (error) {
        console.error('Error fetching attendance data:', error.message);
      }
    };

    fetchData();
  }, [props.email]); // Dependency array includes course and email

  // Calculate percentage of attendance for the selected course
const calculatePercentage = () => {
  console.log("filtered attendance data is",filteredAttendanceData)
  const totalDays = filteredAttendanceData.filter(entry => entry.status !== 'No Lab taken').length;
  const presentDays = filteredAttendanceData.filter(entry => entry.status === 'present').length;
  const percentage = (presentDays / totalDays) * 100;
  setPercentage(percentage.toFixed(2));
};


  // Filter attendance data based on the selected course
  const filteredAttendanceData = selectedCourse === 'All' ?
    attendanceData :
    attendanceData.filter(entry => entry.course === selectedCourse);

  // Get unique courses from attendance data
  const courses = [...new Set(attendanceData.map(entry => entry.course))];

  return (
    <div className="attendance-container">
      <h2>Attendance of {name}</h2>
      {/* Course filter dropdown */}
     <div className='attendancedisplay-option-container'>
     <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
        <option value="All">All Courses</option>
        {courses.map((course, index) => (
          <option key={index} value={course}>{course}</option>
        ))}
      </select>
      {/*button to calculate percentage*/}
      {selectedCourse != 'All' && <div className='attendance-percentage-container'>
        <h3>percentage attendance: {percentage}</h3>
      <button style={{ backgroundColor: 'navy', fontSize: 'medium'}} onClick={calculatePercentage}>calculate</button>
      </div>}
     </div>
      {/* Attendance table */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            {selectedCourse == 'All' &&<th>Course</th>}
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAttendanceData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              {selectedCourse == 'All' && <td>{entry.course}</td>}
              <td>{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceDisplay;
