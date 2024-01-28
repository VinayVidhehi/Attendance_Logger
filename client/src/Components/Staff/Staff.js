import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import performOCR from "../Body/OCRUtil";


const Staff = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [students, setStudents] = useState([]);
  const location = useLocation();
  const email = location.state.email;
  const isCounsellor = location.state.key;
  console.log("isCounsellor", isCounsellor);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7800/attendance-staffview?email=${email}`
        );
        console.log("response is", response.data.students);

        response.data.attendance.map((e, ind) => console.log(e.date));

        if (response.data.key === 1) {
          console.log("am i here");
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

    fetchData();
  }, [email]);

  console.log("attttttttttttttttendance data", attendanceData);
  if (attendanceData.length > 0) {
    attendanceData.map((val, ind) => {
      console.log("each date is", val.date);
    });
  }

  return (
    <div>
      <div>
        <h2>Welcome to AMS</h2>
      </div>
      <div>
        <div>
          <h2>big HEADACHE</h2>
          {attendanceData.length > 0 && students.length > 0 && (
            <table border="1">
              <thead>
                <tr>
                  <th>Student Name</th>
                  {attendanceData.length > 0 &&
                    attendanceData.map((val, index) => (
                      <th key={index}>{val.date}</th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {students.map((student, studentIndex) => (
                  <tr key={studentIndex}>
                    <td>{student.name}</td>
                    {attendanceData.map((entry, entryIndex) => (
                      <td key={entryIndex}>
                        {entry.course52[studentIndex] === "2" &&
                          "Class Not Taken"}
                        {entry.course52[studentIndex] === "0" && "Absent"}
                        {entry.course52[studentIndex] === "1" && "Present"}
                        {/* Add a default case */}
                        {["0", "1", "2"].indexOf(
                          entry.course52[studentIndex]
                        ) === -1 && "Unknown"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {/* Add a placeholder if the data is not loaded yet */}
          {(attendanceData.length === 0 || students.length === 0) && (
            <p>Loading attendance data...</p>
          )}
        </div>
        <div>{ isCounsellor===3 ? <performOCR />: {}}</div>
      </div>
    </div>
  );
};

export default Staff;
