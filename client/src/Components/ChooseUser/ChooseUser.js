import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChooseUser = () => {
  const [staff, setStaff] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const correctPassword = "abcdef1234"; // Change this to your desired password

  const handleStaffSelection = (e) => {
    e.preventDefault();

    if (password === correctPassword) {
      navigate('/signup', { state: { key: false } });
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      <h1>ChooseUser</h1>
      <div>
        <button onClick={() => setStaff(true)}>staff</button>
        {staff && (
          <form onSubmit={handleStaffSelection}>
            <label>
              Enter Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        )}
        <button onClick={() => navigate('/signup', { state: { key: true } })}>
          student
        </button>
      </div>
    </div>
  );
};

export default ChooseUser;
