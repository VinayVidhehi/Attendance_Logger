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
  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state.email;
  console.log("email is ", email);

  useEffect(() => {
    courseData();
  }, []);

  const courseData = async () => {
    const isCounsellor = await axios.get(`http://localhost:7800/counsellor-check?email=${email}`);
    const response = await axios.get(`http://localhost:7800/course-details?email=${email}&key=1`);
    const staffAttendance = await axios.get(`http://localhost:7800/attendance-staffview?email=padmashreet@rvce.edu.in`);
    if(staffAttendance.data.key == 1){
      setStudentAttendance(staffAttendance.data.attendance)
      setAttendance(true);
      console.log("staffview", attendance, staffAttendance.data.attendance)
    }
    if(isCounsellor.data.key == 1) setCounsellor(true);
    if (response.data.key === 1) setCheckCourse(false);
    else console.log("nahhh fill details bruh");
  };

  const handleFetchLeaveRecord = async() => {
    const response = await axios.get(`http://localhost:7800/leave-records?${email}`);
    console.log("response is ", response.data.records);
    const records = response.data.records;
    navigate('/staff/certificate-display', {state:{records}})
  }

  console.log("counsellor",counsellor)

  const CourseDetails = async() => {
    navigate('course-details', {state:{email}});
  }

  const redirectToOCR = () => {
    navigate('/staff/OCR', {state:{email}});
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle the dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  return (
    <div>
      <div>
        <h2>Welcome to AMS</h2>
        {checkCourse && (
          
         <div className="menu-container">
          <button className="menu-button"  onClick={toggleDropdown}>
            <IoMenu />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
             <button onClick = {CourseDetails}>Course Details</button>
            </div>
          )}
        </div>
        )}
      </div>
      <div>
      {counsellor && <div>
        <h2>click here to upload leave document</h2>
            <button style={{ backgroundColor: 'navy', fontSize: 'medium'}} onClick={redirectToOCR}>OCR</button>
            </div>}
      </div>
      <div>
        {attendance &&  <button style={{ backgroundColor: 'navy', fontSize: 'medium'}} onClick={() => navigate('/staff/attendance-staffview', {state:{attendance:studentAttendance}})}>view attendance</button>}
      </div>
     {counsellor &&  <div>
        <button style={{ backgroundColor: 'navy', fontSize: 'medium'}} onClick={handleFetchLeaveRecord}>fetch record</button>
      </div>}
    </div>
  );
};

export default Staff;
