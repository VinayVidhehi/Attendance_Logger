import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./CourseDetails.css";

const CourseDetails = () => {
  const [isLab, setIsLab] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [counsellor, setCounsellor] = useState(0);
  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state.email;

  const handleCourseDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:7800/course-details", {
        email,
        isLab,
        courseId,
        counsellor,
        courseName,
        credits,
      });
      console.log("Response:", response.data);
      if(response.data.key === 1) {
        navigate('../', {state:{message:"succesfully logged in"}});
      }
    } catch (error) {
      console.error("Error updating course details:", error.message);
    }
  };

  return (
    <div className="course-details-container">
      <h2>Update Course Details for 5th semester ISE</h2>
      <form onSubmit={handleCourseDetails}>
        <div>
          <label className="checkbox">
            Does this course contain a Laboratory?
            <input 
              type="checkbox"
              checked={isLab}
              onChange={(e) => setIsLab(e.target.checked)}
            />
          </label>
        </div>
        <div>
          <label>Enter the course ID:</label>
          <input
            type="text"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          />
        </div>
        <div>
          <label>Course Name:</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>
        <div>
          <label>
            Are you a counsellor? If yes, enter the batch number. If not, leave it as 0:
          </label>
          <input
            type="number"
            value={counsellor}
            onChange={(e) => setCounsellor(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>Total number of credits for this course, 0 if it doesn't apply</label>
          <input
            type="number"
            value={credits}
            onChange={(e) => setCredits(parseInt(e.target.value))}
          />
        </div>
        <button type="submit">Update Course Details</button>
      </form>
    </div>
  );
};

export default CourseDetails;
