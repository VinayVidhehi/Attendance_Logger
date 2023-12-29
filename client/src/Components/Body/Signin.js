import React, { useState } from 'react';
import './Signin.css'

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT'); // Assuming STUDENT is the default role

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here, e.g., send data to server
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <div className="signin-from-home">
      <h1>Sign In</h1>
      <h2>know your attendance with a single click</h2>

      <div className="role-selector">
        <label htmlFor="role">Please select your role:</label>
        <select id="role" value={role} onChange={handleRoleChange}>
          <option value="STUDENT">STUDENT</option>
          <option value="TUTOR">TUTOR</option>
          <option value="PARENT">PARENT</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="email-field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type your Email"
          />
        </div>

        <div className="password-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type your password"
          />
        </div>

        <button type="submit">Login</button>
        <a href="#">Forgot your password?</a>
      </form>

      <p className="lorem-ipsum">
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout.
      </p>
    </div>
  );
}

export default SignInForm;
