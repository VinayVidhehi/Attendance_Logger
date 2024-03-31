import React, { useState, useEffect } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usn, setUsn] = useState("");
  const [OTP, setOTP] = useState("");
  const [Name, setName] = useState("");
  const [messages, setMessages] = useState(
    "Enter the correct credentials to sign up"
  );
  const [authenticated, setAuthenticated] = useState(false);
  const [isStudent, setIsStudent] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    handleLoadFormData();
  }, []);

  const handleLoadFormData = async () => {
    const response = await axios.get(
      `http://localhost:7800/course-details?key=0`
    );
    if (response.data.key === 0) {
      console.log("unknown error server down");
      setMessages("please try again later");
    } else {
      const courseDetails = response.data.staffDetails;
      console.log(courseDetails);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setMessages("Loading...");

    // Your authentication logic here

    try {
      const response = await axios.post("http://localhost:7800/signup", {
        email,
        password,
        usn,
        OTP,
        Name,
      });

      // Handle response according to your requirements
      if (response.data.key === 1) {
        console.log("Sign up successful:", response.data.key);
        // Navigate to appropriate route
      } else {
        console.log("Sign up failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error while signing up:", error.message);
    }
  };

  return (
    <div className="login-main-container">
      <div className="login-hero">
        <h1 className="heading-signup-container"> Signup for AMS</h1>
        <h4>{messages}</h4>
        <form onSubmit={handleSignUp}>
          {/* Your form inputs go here */}
          <input
            type="text"
            placeholder="rvce mail id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* Other input fields */}
          <input
            type="text"
            placeholder="USN"
            value={usn}
            onChange={(e) => setUsn(e.target.value)}
          />
          <input
            type="password"
            placeholder="new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="Number"
            placeholder="OTP"
            value={OTP}
            onChange={(e) => setOTP(e.target.value)}
          />
          <input
            type="text"
            placeholder="enter your name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
          />
          <input type="submit" value="Sign up" className="submit" />
        </form>

        <span>
          Already have an account? <Link to="/login">Sign in</Link>
        </span>
      </div>
    </div>
  );
};

export default Signup;
