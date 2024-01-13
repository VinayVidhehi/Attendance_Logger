import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usn, setUsn] = useState("");
  const [OTP, setOTP] = useState(null);
  const [Name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [Counsellor, setCounsellor] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState(
    "Enter the correct credentials to sign up"
  );
  const [courseId, setCourseId] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  
  console.log("the location is ", location.state.key);
  const isStudent = location.state.key;

  const courses = ["AI & ML", "DBS"];
  const counsellors = ["Padmashree", "Sagar", "Srinivas"]; // Add your list of counsellors here
  const labs = ["1", "2", "3"]; // Updated list of labs

  const handleSignUp = async (event) => {
    event.preventDefault();
    setMessages("Loading...");

    if (!authenticated) {
      try {
        const key = 1;
        const response = await axios.post("http://localhost:7800/signup", {
          email,
          key,
        });

        if (response.data.key === 1) {
          setAuthenticated(true);
          setMessages("Please enter the OTP sent to your mail id");
        } else if (response.data.key === 2) {
          setMessages("User already exists, please sign in");
        } else {
          setMessages("Something went wrong");
        }
      } catch (error) {
        console.log("Error while signing up: ", error.message);
      }
    } else {
      if (location.state.key) {
        try {
          const response = await axios.post("http://localhost:7800/signup", {
            email,
            key: 2,
            password,
            usn,
            Name,
            Counsellor,
            batch,
            OTP,
          });

          if (response.data.key) {
            console.log("Sending", email, password);
            navigate("/", { state: { email, password } });
          }
        } catch (error) {
          console.log("Error while signing up: ", error.message);
        }
      } else {
        try {
          const response = await axios.post("http://localhost:7800/signup", {
            email,
            key: 3,
            password,
            Name,
            batch,
            courseId,
            OTP,
          });

          if (response.data.key) {
            console.log("Sending", email, password);
            navigate("/staff", { state: { email, password } });
          }
        } catch (error) {
          console.log("Error while signing up: ", error.message);
        }
      }
    }
  };

  return (
    <div className="login-main-container">
      <div className="login-hero">
        {isStudent && <h2>Sign up </h2>}
        {!isStudent && <h2>Sign up for Staff</h2> }
        <h4>{messages}</h4>
        <form onSubmit={handleSignUp}>
          {/* Your form inputs go here */}
          <input
            type="text"
            placeholder="rvce mail id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {authenticated &&
            isStudent && (
              <input
                type="text"
                placeholder="USN"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
              />
            )}
          {authenticated && (
            <input
              type="password"
              placeholder="new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          {authenticated && (
            <input
              type="Number"
              placeholder="OTP"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
            />
          )}
          {authenticated && (
            <input
              type="text"
              placeholder="enter your name"
              value={Name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {authenticated && (
            <select value={batch} onChange={(e) => setBatch(e.target.value)}>
              <option value="" disabled>
                {isStudent && <h3>Select </h3>}
                {!isStudent && <h3>if you are the counsellor, then select the batch for which you are counsellor for. Skip otherwise</h3>}
              </option>
              {labs.map((lab, index) => (
                <option key={index} value={lab}>
                  {lab}
                </option>
              ))}
            </select>
          )}

          {authenticated && isStudent && (
            <select
              value={Counsellor}
              onChange={(e) => setCounsellor(e.target.value)}
            >
              <option value="" disabled>
                Select counsellor
              </option>
              {counsellors.map((counselor, index) => (
                <option key={index} value={counselor}>
                  {counselor}
                </option>
              ))}
            </select>
          )}

          {authenticated && !isStudent && (
            <div>
              <h3>what course do you handle</h3>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
              >
                {courses.map((courseId, index) => (
                  <option key={index} value={courseId}>
                    {courseId}
                  </option>
                ))}
              </select>
            </div>
          )}

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
