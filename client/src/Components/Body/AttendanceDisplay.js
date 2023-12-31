// AttendanceDisplay.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceDisplay = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    // Fetch attendance data when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('https://textstrict-app.onrender.com/get-attendance');
        setAttendanceData(response.data);
      } catch (error) {
        console.error('Error fetching attendance data:', error.message);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div>
      <p>Attendance Display</p>
      <ul>
        {attendanceData.map((entry) => (
          <li key={entry.id}>{`${entry.date}: ${entry.status}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default AttendanceDisplay;
