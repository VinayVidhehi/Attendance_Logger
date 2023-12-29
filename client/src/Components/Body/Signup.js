import React, {useState} from 'react';
import './Signin.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [OTP, setOTP] = useState(0);
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState("enter the correct credentials to sign up");

  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setMessages("loading...")
    console.log("username from home is ",username)
    
    if(!authenticated) {
      console.log("i m here at initial sign up")
      try {
        const key = 1;
        const response = await axios.post('http://localhost:7700/signup', {
          username,
          key,
        });
        console.log("response is ", response.data)
        if (response.data.key === 1) {
          setAuthenticated(true);
          setMessages("please enter the OTP sent to your mail id")
        }
        else if(response.data.key === 2) {
          setMessages("User already exists, please sign in");
        } 
        else {
          setMessages("something went wrong");
        }
      } catch (error) {
        console.log("error while signing up ", error.message);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:5500/signup', {
          username,
          password,
          OTP,
        });
        console.log("response is ", response.data)
        if (response.data.key) {
           console.log("snding", username, password)
           navigate('/userinfo', {state:{username, password}});
        }
      } catch (error) {
        console.log("error while signing up ", error.message);
      }
    }
  }

  return (

    <div className='login-main-container'>
      <div className="login-hero">
        <h2>Sign up</h2>
        <h4>{messages}</h4>
            <form action="" onSubmit={handleSignUp}>
              {/* Your form inputs go here */}
              <input type="text" placeholder='email eg:maneesh.cs22@rvce.edu.in' value={username} onChange={(e) => setUsername(e.target.value)} />
              {authenticated && <input type="password" placeholder='new password' value={password} onChange={(e) => setPassword(e.target.value)} />}
              {authenticated && <input type="Number" placeholder='OTP' value={OTP} onChange={(e) => setOTP(e.target.value)} />}
  
          <input type="submit" value="Sign up" className='submit'/>

        </form>
        
        <span>Already have an account? <Link to='/'>Sign in</Link></span>
      </div>
    </div>
  )
}

export default Signup