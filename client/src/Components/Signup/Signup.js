import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usn, setUsn] = useState('');
  const [OTP, setOTP] = useState(null);
  const [Name, setName] = useState('');
  const [batch, setBatch] = useState('');
  const [Counsellor, setCounsellor] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [messages, setMessages] = useState('Enter the correct credentials to sign up');

  const navigate = useNavigate();

  const counsellors = ['Padmashree', 'Sagar', 'Srinivas']; // Add your list of counsellors here

  const handleSignUp = async (event) => {
    event.preventDefault();
    setMessages('Loading...');

    if (!authenticated) {
      try {
        const key = 1;
        const response = await axios.post('http://localhost:7800/signup', {
          email,
          key,
        });

        if (response.data.key === 1) {
          setAuthenticated(true);
          setMessages('Please enter the OTP sent to your mail id');
        } else if (response.data.key === 2) {
          setMessages('User already exists, please sign in');
        } else {
          setMessages('Something went wrong');
        }
      } catch (error) {
        console.log('Error while signing up: ', error.message);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:7800/signup', {
          email,
          password,
          usn,
          OTP,
          Name,
          batch,
          Counsellor,
        });

        if (response.data.key) {
          console.log('Sending', email, password);
          navigate('/', { state: { email, password } });
        }
      } catch (error) {
        console.log('Error while signing up: ', error.message);
      }
    }
  };

  return (
    <div className="login-main-container">
      <div className="login-hero">
        <h2>Sign up</h2>
        <h4>{messages}</h4>
        <form action="" onSubmit={handleSignUp}>
          {/* Your form inputs go here */}
          <input type="text" placeholder="RVCE mail id" value={email} onChange={(e) => setEmail(e.target.value)} />
          {authenticated && <input type="text" placeholder="USN" value={usn} onChange={(e) => setUsn(e.target.value)} />}
          {authenticated && <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />}
          {authenticated && <input type="number" placeholder="OTP" value={OTP} onChange={(e) => setOTP(e.target.value)} />}
          {authenticated && <input type="text" placeholder="Name" value={Name} onChange={(e) => setName(e.target.value)} />}
          {authenticated && <input type="number" placeholder="Batch number" value={batch} onChange={(e) => setBatch(e.target.value)} />}
          {authenticated && (
            <div>
              <label htmlFor="counsellor">Counsellor:</label>
              <select id="counsellor" value={Counsellor} onChange={(e) => setCounsellor(e.target.value)}>
                <option value="">Select Counsellor</option>
                {counsellors.map((c, index) => (
                  <option key={c} value={index}>
                    {c}
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
