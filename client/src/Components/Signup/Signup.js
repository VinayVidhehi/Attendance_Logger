import React, { useState, useEffect } from "react";
import "./Signup.css";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usn, setUsn] = useState("");
  const [OTP, setOTP] = useState(null);
  const [Name, setName] = useState("");
  const [batch, setBatch] = useState("");
 // const [batches, setBatches] = useState("");
  const [Counsellor, setCounsellor] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [counsellors, setCounsellors] = useState([]);
  const [messages, setMessages] = useState(
    "Enter the correct credentials to sign up"
  );
  const [courseId, setCourseId] = useState("");
  const [isStudent, setIsStudent] = useState(true);

  const navigate = useNavigate();

  const batches = [1,2,3];

  useEffect(()=> {
    handleLoadFormData();
  }, [isStudent]);

  const handleLoadFormData = async() => {
     const response = await axios.get('http://localhost:7800/course-details');
     if (response.data.key === 0) {
      console.log("unknown error server down");
      setMessages("please try again later");
     } else {
          const courseDetails = response.data.staffDetails[0];
          console.log(courseDetails);
          //setCourses(courseDetails)
     }
  }

  const handleSignUp = async (event) => {
    event.preventDefault();
    //navigate('/staff', {state:{email, key:3}})
    setMessages("Loading...");

    if(email.endsWith('.is21@rvce.edu.in') || email.endsWith('.is22@rvce.edu.in')) setIsStudent(true);
    else setIsStudent(false);

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
      if (isStudent) {
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
            OTP,
          });

          if (response.data.key === 1) {
            console.log("Sending", email, password);
            navigate("/staff", { state: { email} });
          } else if (response.data.key === 2) {
            setMessages(response.data.message);
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
        Signup for AMS
        <h4>{messages}</h4>
        <form onSubmit={handleSignUp}>
          {/* Your form inputs go here */}
          <input
            type="text"
            placeholder="rvce mail id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {authenticated && isStudent && (
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
                
              </option>
              {batches.map((lab, index) => (
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
