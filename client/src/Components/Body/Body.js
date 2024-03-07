import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import AttendanceDisplay from "./AttendanceDisplay";
//import PerformOCR from './OCR';
import "./Body.css";

const Body = () => {
  const location = useLocation();

  return (
    <div id="main-container">
      <div></div>

      <div className="login">
        <Link to="/login" className="login_button">
          Login
        </Link>
      </div>

      <section>
        <div className="heading-body-container">Welcome to AMS</div>

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
          <div className="cards-container">
  <div className="card">
    <h3>Effortless Attendance Tracking</h3>
    <p>Track attendance effortlessly with our user-friendly system.</p>
  </div>
  <div className="card">
    <h3>Real-time Reporting and Analytics</h3>
    <p>Access real-time reports and analytics to monitor attendance trends.</p>
  </div>
  <div className="card">
    <h3>User-Friendly Interface for Both Students and Staff</h3>
    <p>Enjoy a simple and intuitive interface designed for everyone.</p>
  </div>
  <div className="card">
    <h3>Leave Management with Easy Request Submission</h3>
    <p>Submit leave requests easily and manage your schedule efficiently.</p>
  </div>
</div>

         
        </div>
      </section>
    </div>
  );
};

export default Body;
