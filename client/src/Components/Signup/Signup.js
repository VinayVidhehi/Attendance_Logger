import React, {useState} from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usn, setUsn] = useState("");
  const [OTP, setOTP] = useState(null);
  const [Name, setName] = useState("");
  const [batch, setBatch] = useState("");
  const [Counsellor, setCounsellor] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState("enter the correct credentials to sign up");

  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setMessages("loading...")
    console.log("email from home is ",email)
    
    if(!authenticated) {
      console.log("i m here at initial sign up")
      try {
        const key = 1;
        const response = await axios.post('https://textstrict-app.onrender.com/signup', {
          email,
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
        const response = await axios.post('https://textstrict-app.onrender.com/signup', {
          email,
          password,
          usn,
          OTP,
          Name, 
          batch,
          Counsellor,
        });
        console.log("response is ", response.data)
        if (response.data.key) {
           console.log("sending", email, password)
           navigate('/', {state:{email, password}});
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
              <input type="text" placeholder='rvce mail id' value={email} onChange={(e) => setEmail(e.target.value)} />
              {authenticated && <input type="text" placeholder='USN' value={usn} onChange={(e) => setUsn(e.target.value)} />}
              {authenticated && <input type="password" placeholder='new password' value={password} onChange={(e) => setPassword(e.target.value)} />}
              {authenticated && <input type="Number" placeholder='OTP' value={OTP} onChange={(e) => setOTP(e.target.value)}  />}
              {authenticated && <input type="text" placeholder='Name' value = {Name} onChange={(e) => setName(e.target.value)}/>}
              {authenticated && <input type="Number" placeholder='batch number' value = {batch} onChange={(e) => setBatch(e.target.value)}/>}
              {authenticated && <input type="text" placeholder='Counsellor Name' value = {Counsellor} onChange={(e) => setCounsellor(e.target.value)}/>}

          <input type="submit" value="Sign up" className='submit'/>

        </form>
        
        <span>Already have an account? <Link to='/login'>Sign in</Link></span>
      </div>
    </div>
  )
}

export default Signup