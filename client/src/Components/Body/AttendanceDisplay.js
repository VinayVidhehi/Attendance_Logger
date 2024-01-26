import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AttendanceDisplay.css'; // Import the CSS file

const AttendanceDisplay = (props) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [name, setName] = useState("user");
  const [displayMode, setDisplayMode] = useState('percentage');

  useEffect(() => {
    // Fetch attendance data when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:7800/get-attendance', {
          params: {
            email: props.email,
          },
        });
        setAttendanceData(response.data.attendance); // Extract the attendance array
        setName(response.data.name)
      } catch (error) {
        console.error('Error fetching attendance data:', error.message);
      }
    };

    fetchData();
  }, [props.email]); // Dependency array includes course and email

  // Function to calculate attendance percentage
  const calculateAttendancePercentage = (entry) => {
    const presentDays = entry.filter((day) => day.status === true && day.key !== 2).length;
    const totalDays = entry.filter((day) => day.key !== 2).length;
    if (totalDays === 0) return 'N/A'; // Avoid division by zero
    return ((presentDays / totalDays) * 100).toFixed(2) + '%';
  };

  // Function to toggle display mode
  const toggleDisplayMode = () => {
    setDisplayMode(displayMode === 'percentage' ? 'table' : 'percentage');
  };

  return (
    <div className="attendance-container">
      <h2>Attendance of {name}</h2>
      <button onClick={toggleDisplayMode}>
        {displayMode === 'percentage' ? 'View Full Attendance' : 'Show Attendance Percentage'}
      </button>
      {displayMode === 'percentage' ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Attendance Percentage</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{calculateAttendancePercentage(entry)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>DBS</th>
              <th>AI & ML</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                {entry.key === 2 ? (
                  <>
                    <td>{entry.status ? 'Present' : 'Absent'}</td>
                    <td>-</td>
                  </>
                ) : (
                  <>
                    <td>-</td>
                    <td>{entry.status ? 'Present' : 'Absent'}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceDisplay;
