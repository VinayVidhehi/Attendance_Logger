import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendanceDisplay.css'; // Import the CSS file

const AttendanceDisplay = (props) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [name, setName] = useState("user");

  useEffect(() => {
    // Fetch attendance data when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('https://textstrict-app.onrender.com/get-attendance', {
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

  return (
    <div className="attendance-container">
      <h2>Attendance of {name}</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Course</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.course}</td>
              <td>{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceDisplay;
