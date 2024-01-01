import React, { useEffect, useState } from 'react';
import {useLocation, Link } from 'react-router-dom';
import AttendanceDisplay from './AttendanceDisplay';
//import PerformOCR from './OCR';
import "./Body.css"

const Body = () => {
  const location = useLocation();
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    // Check if email and password are present in location state
    if (location.state && location.state.email && location.state.password) {
      // If email and password are present, show welcome message
      console.log("Received props:", location.state.email, location.state.password);
    }
  }, [location.state]);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <div>
      {location.state && location.state.email && location.state.password ? (
        <div>
          <p>Hello, welcome to AMS!</p>
          {/* Dropdown for selecting course */}
          <section>
            <div>
              <label htmlFor="courseDropdown">Select Course:</label>
              <select id="courseDropdown" onChange={handleCourseChange}>
                <option value="">Select...</option>
                <option value="DBS_Lab_eg">DBS</option>
                <option value="AI-ML">AI and ML</option>
              </select>
            </div>
  
            {/* Display attendance based on the selected course */}
            {selectedCourse && <AttendanceDisplay course={selectedCourse} email={location.state.email} />}
          </section>
        </div>
      ) : (
        <Link to="/login" className="login_button">
          Login
        </Link>
      )}
  
      <section>
        <div className="welcome-content">
          <div className="text-content">
            <p className="welcome">Your User-Friendly Attendance Management System</p>
            <p>
              Welcome to AMS – the cutting-edge system designed for the Department of ISE.
              Whether you're a student or staff member, log in or sign up now to experience our seamless
              attendance management facilities. Streamline your attendance tracking with AMS.
            </p>
          </div>
        </div>
      </section>
  
      <section className="features">
        <div className="features-section">
          <p className="welcome">Key Features</p>
          <ul>
            <li>Effortless Attendance Tracking</li>
            <li>Real-time Reporting and Analytics</li>
            <li>User-Friendly Interface for Both Students and Staff</li>
            <li>Leave Management with Easy Request Submission</li>
          </ul>
          <div className="bouncing-text">I'll add some effect here</div>
        </div>
      </section>
    </div>
  );
};

export default Body;
