import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import performOCR from "./OCRUtil";
import axios from 'axios';

const PerformOCR = () => {
  const [image, setImage] = useState(null);
  const [details, setDetails] = useState(null);

  const location = useLocation();
  const email = location.state.email;

  console.log("email in ocr is", email);

  const submitOCRDetails = async() => {
    const response = axios.post('https://textstrict-app.onrender.com/perform-ocr',{details})
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleOCR = async () => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    try {
      const text = await performOCR(image);

      // Extract USN
      const usnPattern = /\b1RV\w+\b/;
      const usnMatch = text.match(usnPattern);
      const usnText = usnMatch ? usnMatch[0] : "No USN found";

      // Extract email
      const emailPattern = /\b[\w.%+-]+@rvce.edu.in\b/;
      const emailMatch = text.match(emailPattern);
      const emailText = emailMatch ? emailMatch[0] : "No email found";

      // Extract "from" date
      const fromDatePattern = /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/;
      const fromDateMatch = text.match(fromDatePattern);
      const fromDateText = fromDateMatch
        ? fromDateMatch[0]
        : 'No "from" date found';

      // Extract "to" date
      const toDatePattern = /\bto\b\s+(\d{1,2}\/\d{1,2}\/\d{4})\b/;
      const toDateMatch = text.match(toDatePattern);
      const toDateText = toDateMatch ? toDateMatch[1] : 'No "to" date found';
      // Set the extracted text
      const extractedDetails = {
        usn: usnText,
        email: emailText,
        fromDate: fromDateText,
        toDate: toDateText,
        reason:text,
      };

      setDetails(extractedDetails);
      console.log("details are", details);

      //here it should post request using axios to the server sending all four extracted usn email from and date
    } catch (error) {
      console.error("Error performing OCR:", error);
    }
  };

  return (
    <div>
      <div></div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button style={{ backgroundColor: 'navy', fontSize: 'medium'}} onClick={handleOCR}>convert</button>
      {details != null && <div>
        <h2>Extracted Text:</h2>
        <p>{details.email}</p>
        <p>{details.toDate}</p>
        <p>{details.fromDate}</p>
        <p>{details.reason}</p>
      </div>}
      <button style={{ backgroundColor: 'navy', fontSize: 'medium'}} onClick={submitOCRDetails}>Upload</button>
    </div>
  );
};

export default PerformOCR;
