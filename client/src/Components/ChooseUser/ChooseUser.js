import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChooseUser.css"; // Make sure to import your CSS file

// Import your image
import yourImageSrc from "../../images/STAFF.png"; // Replace with the actual path
import myImageSrc from "../../images/student.png"; // Replace with the actual path
import SubmitImageSrc from "../../images/SUBMIT.png"; // Replace with the actual path
import  Chooseuser from "../../images/Chooseuser.png"; // Replace with the actual path

const ChooseUser = () => {
  const [staff, setStaff] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const correctPassword = "abcdef1234"; // Change this to your desired password

  const handleStaffSelection = (e) => {
    e.preventDefault();

    if (password === correctPassword) {
      navigate("/signup", { state: { key: false } });
    } else {
      navigate("/");
    }
  };

  const handleStudentSelection = () => {
    navigate("/signup", { state: { key: true } });
  };

  return (
    <div className="choose-user-container">
      <h1> Choose User</h1>
      <div>
        <img
          src={yourImageSrc}
          alt="Staff"
          className="user-image"
          onClick={() => setStaff(true)}
        />
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
            <img
              src={SubmitImageSrc}
              alt="Submit"
              className="submit-image"
              onClick={handleStaffSelection}
            />
          </form>
        )}
        <img
          src={myImageSrc}
          alt="Student"
          className="user-image"
          onClick={handleStudentSelection}
        />
      </div>
    </div>
  );
};

export default ChooseUser;
