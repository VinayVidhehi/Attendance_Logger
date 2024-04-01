import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Staff.css";
import { IoMenu } from "react-icons/io5";

const Staff = () => {
  const [checkCourse, setCheckCourse] = useState(true);
  const [counsellor, setCounsellor] = useState(false);
  const [attendance, setAttendance] = useState(false);
  const [studentAttendance, setStudentAttendance] = useState("");
  const [notifications, setNotifications] = useState("loading, please wait")
  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state.email;
  console.log("email is ", email);

  useEffect(() => {
    courseData();
  }, []);

  const courseData = async () => {
    const response = await axios.get(
      `https://textstrict-app.onrender.com/course-details?email=${email}&key=1`
    );
    setNotifications("choose from the following")
    if (response.data.key === 1) {
      setCheckCourse(false);
      console.log("am i here?");
      const isCounsellor = await axios.get(
        `https://textstrict-app.onrender.com/counsellor-check?email=${email}`
      )
        if (isCounsellor.data.key == 1) setCounsellor(true);

        const staffAttendance = await axios.get(
          `https://textstrict-app.onrender.com/attendance-staffview?email=${email}`
        );
          if (staffAttendance.data.key == 1) {
            setStudentAttendance(staffAttendance.data.attendance);
            setAttendance(true);
            console.log("staffview", attendance, staffAttendance.data.attendance);
          }
    }
    else {
      setNotifications("please fill the course details")
    }
  };

  const handleFetchLeaveRecord = async () => {
    const response = await axios.get(
      `https://textstrict-app.onrender.com/leave-records?${email}`
    );
    console.log("response is ", response.data.records);
    const records = response.data.records;
    navigate("/staff/certificate-display", { state: { records } });
  };

  const CourseDetails = async () => {
    navigate("course-details", { state: { email } });
  };

  const redirectToOCR = () => {
    navigate("/staff/OCR", { state: { email } });
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div>
      <div>
        <h1 style={{textAlign:'center'}}>Welcome to AMS</h1>
        <h2 style={{textAlign: 'center'}}>{notifications}</h2>
        {checkCourse && (
          <div className="menu-container">
            <button className="menu-button" onClick={toggleDropdown}>
              <IoMenu />
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content">
                <button onClick={CourseDetails}>Course Details</button>
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        {counsellor && (
          <div style={{display: 'flex', flexDirection : 'column', justifyContent:'center', alignItems: 'center'}}>
            <h3 style={{textAlign: 'left'}}>click here to upload students' leave document</h3>
            <button
              style={{  backgroundColor: "navy", fontSize: "medium", width: '50%' }}
              onClick={redirectToOCR}
            >
              OCR
            </button>
          </div>
        )}
      </div>
      <div>
        {attendance && (
         <div style={{display: 'flex', flexDirection : 'column', justifyContent:'center', alignItems: 'center'}}>
           <h3 style={{textAlign: 'left'}}>click here to view attendance</h3>
          <button
            style={{ backgroundColor: "navy", fontSize: "medium", width: '50%' }}
            onClick={() =>
              navigate("/staff/attendance-staffview", {
                state: { attendance: studentAttendance },
              })
            }
          >
            view
          </button>
         </div>
        )}
      </div>
      {counsellor && (
        <div  style={{display: 'flex', flexDirection : 'column', justifyContent:'center', alignItems: 'center'}}>
          <h3 style={{textAlign: 'center'}}>click here to fetch leave records</h3>
          <button
            style={{  backgroundColor: "navy", fontSize: "medium", width: '50%' }}
            onClick={handleFetchLeaveRecord}
          >
            fetch
          </button>
        </div>
      )}
    </div>
  );
};

export default Staff;
