import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Staff.css";
import { IoMenu } from "react-icons/io5";
import PerformOCR from '../Body/OCR';


const Staff = () => {

  const [checkCourse, setCheckCourse] = useState(true);
  const [counsellor, setCounsellor] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state.email;
  console.log("email is ", email);

  useEffect(() => {
    courseData();
  }, []);

  const courseData = async () => {
    const isCounsellor = await axios.get(`https://textstrict-app.onrender.com/counsellor-check?email=${email}`);
    const response = await axios.get(`https://textstrict-app.onrender.com/course-details?email=${email}&key=1`);
    if(isCounsellor.data.key == 1) setCounsellor(true);
    if (response.data.key === 1) setCheckCourse(false);
    else console.log("nahhh fill details bruh");
  };

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
      {counsellor && <div>
        <h2>click here to upload leave document</h2>
            <button onClick={redirectToOCR}>OCR</button>
            </div>}
    </div>
  );
};

export default Staff;
