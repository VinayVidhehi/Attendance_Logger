import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Staff.css";
import { IoMenu } from "react-icons/io5";
const Staff = () => {

  const [checkCourse, setCheckCourse] = useState(true);
  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state.email;
  console.log("email is ", email);

  useEffect(() => {
    courseData();
  }, []);

  const courseData = async () => {
    const response = await axios.get(`https://textstrict-app.onrender.com/course-details?email=${email}&key=1`);
    if (response.data.key === 1) setCheckCourse(false);
    else console.log("nahhh fill details bruh");
  };


  const CourseDetails = async() => {
    navigate('course-details', {state:{email}});
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
     
    </div>
  );
};

export default Staff;
