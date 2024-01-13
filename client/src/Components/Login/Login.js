
import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState("enter the login credentials here to login");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessages("loading...,")
    // console.log("password is ", password);
    const response = await axios.post('http://localhost:7800/login', {
      email,
      password,
    })

    if(response.data.key === 1) {
        setMessages("logged in successfully");
        //console.log("response has all this and that is ", response.data.response.nickname);
        navigate('/', {state:{email,password}});
    }
    else {
        setMessages("wrong credentials, try again");
    }
  }

  return (
    <div className='login-main-container'>
      <div className="login-hero">
        <h2>Log in to AMS</h2>
        <br/>
        <p>{messages}</p>
        <form onSubmit={handleLogin}>
        <input type="text" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder='enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="submit" value="Sign in" className='submit'/>
        </form>
        <span>Don't have an account? <Link to='/choose'>Sign up</Link></span>
      </div>
    </div>
  )
}

export default Login