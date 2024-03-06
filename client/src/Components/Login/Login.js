import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState(
    "enter the login credentials here to login"
  );
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessages("loading...,");
    // console.log("password is ", password);
    const response = await axios.post("http://localhost:7800/login", {
      email,
      password,
    });

    if (response.data.key === 1) {
      setMessages("logged in successfully");
      navigate("/student", { state: { email, password } });
    } else if (response.data.key === 2) {
      setMessages("logged in succuessfully");
      navigate("/staff", { state: { email, password, key: 2 } });
    } else if (response.data.key === 3) {
      setMessages("logged in succuessfully");
      navigate("/staff", { state: { email, password, key: 3 } });
    } else if(response.data.key === 4){
      setMessages("wrong credentials, try again");
    } else {
      setMessages("User Not found, please sign-up");
    }
  };

  return (
    <div className="login-main-container">
      <div className="login-hero">
        <h2>Log in to AMS</h2>
        <br />
        <p>{messages}</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" value="Sign in" className="submit" />
        </form>
        <span>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </span>
      </div>
    </div>
  );
};

export default Login;
