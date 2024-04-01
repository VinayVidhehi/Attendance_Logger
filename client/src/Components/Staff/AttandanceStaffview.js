import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AttendanceStaffView = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);
  const [absentCount, setAbsentCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const location = useLocation();

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

    attendanceData.forEach((student) => {
      const attendanceStatus = attendanceDates.find((item) =>
        selectedDate
          ? new Date(item.date).toDateString() === selectedDate.toDateString()
          : true
      )?.attendance[student.student_id];
      if (
        (selectedAttendance === "All" || selectedAttendance === attendanceStatus) &&
        (!selectedDate ||
          (selectedDate &&
            attendanceStatus &&
            new Date(attendanceDates[0].date).toDateString() ===
              selectedDate.toDateString()))
      ) {
        if (attendanceStatus === "0") {
          absent++;
        } else if (attendanceStatus === "1") {
          present++;
        }
      }
    });

    setAbsentCount(absent);
    setPresentCount(present);
  }, [selectedDate, selectedAttendance, attendanceData, attendanceDates]);

  return (
    <div>
      <h2>Attendance</h2>
      <p style={{color:"navyblue", fontFamily:"serif", fontSize:20}}>Choose from the following filters</p>
      <select
        value={selectedAttendance}
        onChange={(e) => setSelectedAttendance(e.target.value)}
      >
        <option value="All">All Attendance</option>
        <option value="0">Absent</option>
        <option value="1">Present</option>
        <option value="2">Class not taken</option>
      </select>
      <input
        style={{padding:14}}
        type="date"
        value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      />
      <p style={{color:"navyblue", fontFamily:"serif", fontSize:20}}>Number of absentees: {absentCount}</p>
      <p style={{color:"navyblue", fontFamily:"serif", fontSize:20}}>Number of presentees: {presentCount}</p>
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            {attendanceDates.map((item, index) => {
              const currentDate = new Date(item.date).toDateString();
              const selectedDateString = selectedDate
                ? selectedDate.toDateString()
                : "";
              if (selectedDateString === currentDate) {
                return (
                  <th key={index}>{new Date(item.date).toLocaleDateString()}</th>
                );
              } else {
                return null;
              }
            })}
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((student, index) => (
            <tr key={index}>
              <td>{student.student_id}</td>
              <td>{student.student_name}</td>
              {attendanceDates.map((item, idx) => {
                const currentDate = new Date(item.date).toDateString();
                const selectedDateString = selectedDate
                  ? selectedDate.toDateString()
                  : "";
                if (selectedDateString === currentDate) {
                  return (
                    <td key={idx}>
                      {item.attendance[student.student_id] === "0"
                        ? "Absent"
                        : item.attendance[student.student_id] === "1"
                        ? "Present"
                        : "-"}
                    </td>
                  );
                } else {
                  return null;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceStaffView;
