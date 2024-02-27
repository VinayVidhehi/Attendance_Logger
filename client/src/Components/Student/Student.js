import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AttendanceDisplay from "../Body/AttendanceDisplay";
import "./Student.css";

const Student = () => {
  const [attendancekey, setAttendancekey] = useState(false);
  const [buttonmessage, setButtonmessage] = useState("view attendance");

  const location = useLocation();
  const email = location.state.email;
  const handleViewAttendance = () => {
    console.log("view attendance button clicked");
    setAttendancekey(!attendancekey);
    if (buttonmessage === "close") setButtonmessage("view attendance");
    else setButtonmessage("close");
  };

  return (
    <div id="main-container">
      <div>
        <div>Welcome to AMS</div>
        <div>
          <button onClick={handleViewAttendance}>{buttonmessage}</button>
        </div>
      </div>

      {attendancekey && (
        <div>
          <AttendanceDisplay email={email} />
        </div>
      )}
    </div>
  );
};

export default Student;