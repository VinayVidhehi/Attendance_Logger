import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import AttendanceDisplay from "./AttendanceDisplay";
//import PerformOCR from './OCR';
import "./Body.css";

const Body = () => {
 

  const location = useLocation();



  return (
    <div id="main-container">
     
        <div>
          
        </div>
      
    <div className="login">
        <Link to="/login"  className="login_button">
          Login
        </Link>
        </div>  
         
    
      <section>
      <div>Welcome to AMS</div>
         
        <div className="welcome-content">
          <div className="text-content">
            <p className="welcome">
              Your User-Friendly Attendance Management System
            </p>
            <p>
              Welcome to AMS – the cutting-edge system designed for the
              Department of ISE. Whether you're a student or staff member, log
              in or sign up now to experience our seamless attendance management
              facilities. Streamline your attendance tracking with AMS.
            </p>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-section">
          <p className="welcome">Key Features</p>
          <ul classname = "list">
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
