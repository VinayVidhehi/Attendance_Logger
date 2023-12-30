import React, { useEffect } from 'react';
import {useLocation, Link } from 'react-router-dom';
//import PerformOCR from './OCR';

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
        <Link to="/login">Login</Link>
      )}
      <div>
        <h3>do something here, to start with, click on login there go to signup and sign up urself later you will come here back and i ll greet you, subsequent times, you can just log in please remove me and add something better, all the login and signup page including myself has to styled properly. Just run client using command npm run start, backend is deployed you dont have to do anything. Lets do something, bigger and better :]</h3>
      </div>
      {/*<PerformOCR />*/}
    </div>
  );
};

export default Body;
