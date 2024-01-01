// AttendanceDisplay.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendanceDisplay.css'; // Import the CSS file

const AttendanceDisplay = ({ course, email }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [name, setName] = useState("user");

  useEffect(() => {
    // Fetch attendance data when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7700/get-attendance', {
          params: {
            course: course,
            email: email,
          },
        });
        setAttendanceData(response.data.attendance); // Extract the attendance array
        setName(response.data.name)
      } catch (error) {
        console.error('Error fetching attendance data:', error.message);
      }
    };

    fetchData();
  }, [course, email]); // Dependency array includes course and email

  return (
    <div className="attendance-container">
      <h2>Attendance of {name}</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.date}</td>
              <td>{entry.status ? 'Present' : 'Absent'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceDisplay;
