import React, { useEffect } from 'react';
import {useLocation, Link } from 'react-router-dom';
//import PerformOCR from './OCR';
import "./Body.css"

const Body = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if email and password are present in location state
    if (location.state && location.state.email && location.state.password) {
      // If email and password are present, show welcome message
      console.log("Received props:", location.state.email, location.state.password);
    }
  }, [location.state]);

  return (
    <div>
      {location.state && location.state.email && location.state.password ? (
        <p>Hello, welcome to AMS!</p>
      ) : (
        <Link to="/login" >Login</Link>
      )}
      <section>
       <div className="welcome-content">
        <div className="text-content">
          
          <p className="welcome">Your User-Friendly Attendance Management System</p>
          <p>
            Welcome to AMS – the cutting-edge system designed for the Department of ISE. Whether you're a student or staff member, log in or sign up now to experience our seamless attendance management facilities. Streamline your attendance tracking with AMS.
          </p>
        </div>
        </div>
        </section>
      {/*<PerformOCR />*/}
      {/* Additional Section for Features */}
      <section>
              <div className="features-section">
        <p className='welcome'>Key Features</p>
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
