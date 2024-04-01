import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AttendanceStaffView = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState("All");
  const [absentCount, setAbsentCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const location = useLocation();

  // Compute filtered attendance data
  const filteredAttendanceData = attendanceData.filter((student) => {
    return attendanceDates.some((item) => {
      const attendanceStatus = item.attendance[student.student_id];
      return selectedAttendance === "All" || selectedAttendance === attendanceStatus;
    });
  });

  useEffect(() => {
    if (location.state && location.state.attendance) {
      const attendance = location.state.attendance;
      console.log(attendance);
      if (attendance.students && attendance.attendanceString) {
        setAttendanceData(attendance.students);
        setAttendanceDates(attendance.attendanceString);
      }
    }
  }, [location.state]);

  useEffect(() => {
    let absent = 0;
    let present = 0;

    filteredAttendanceData.forEach((student) => {
      attendanceDates.forEach((item) => {
        const attendanceStatus = item.attendance[student.student_id];
        if (selectedAttendance === "All" || selectedAttendance === attendanceStatus) {
          if (attendanceStatus === "0") {
            absent++;
          } else if (attendanceStatus === "1") {
            present++;
          }
        }
      });
    });

    setAbsentCount(absent);
    setPresentCount(present);
  }, [filteredAttendanceData, selectedAttendance, attendanceDates]);

  return (
    <div>
      <h2>Attendance</h2>
      <select
        value={selectedAttendance}
        onChange={(e) => setSelectedAttendance(e.target.value)}
      >
        <option value="All">All Attendance</option>
        <option value="0">Absent</option>
        <option value="1">Present</option>
        <option value="2">Class not taken</option>
      </select>
      <p>Number of absentees: {absentCount}</p>
      <p>Number of presentees: {presentCount}</p>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            {attendanceDates.map((item, index) => (
              <th key={index}>{new Date(item.date).toLocaleDateString()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredAttendanceData.map((student, index) => (
            <tr key={index}>
              <td>{student.student_id}</td>
              <td>{student.student_name}</td>
              {attendanceDates.map((item, idx) => (
                <td key={idx}>
                  {item.attendance[student.student_id] === "0"
                    ? "Absent"
                    : item.attendance[student.student_id] === "1"
                    ? "Present"
                    : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceStaffView;
