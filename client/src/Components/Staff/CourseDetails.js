import React, { useState } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import axios from "axios";


const CourseDetails = () => {
  const [isLab, setIsLab] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [counsellor, setCounsellor] = useState(0);
  const [courseName, setCourseName] = useState("");
  const [credits, setCredits] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state.email;
  console.log(email);

  const handleCourseDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://textstrict-app.onrender.com/course-details", {
        email,
        isLab,
        courseId,
        counsellor,
        courseName,
        credits,
      });
      console.log("Response:", response.data);
      if(response.data.key == 1) {
        navigate('../', {state:{message:"succesfully logged in"}});
      }
    } catch (error) {
      console.error("Error updating course details:", error.message);
    }
  };

  return (
    <div>
      <h3>Update Course Details</h3>
      <form onSubmit={handleCourseDetails}>
        <div>
          <label>
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
          <label>Total number of credits for this course:</label>
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
