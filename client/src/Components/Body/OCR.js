import React, { useState } from "react";
import performOCR from "./OCRUtil";

const PerformOCR = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");

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
      const emailPattern = /\b[\w.%+-]+@rvce\.edu\.in\b/;
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
      setExtractedText(
        `USN: ${usnText}\nEmail: ${emailText}\nfrom: ${fromDateText}\nto: ${toDateText}`
      );

      //here it should post request using axios to the server sending all four extracted usn email from and date
    } catch (error) {
      console.error("Error performing OCR:", error);
    }
  };

  return (
    <div>
      <div></div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleOCR}>upload</button>
      <div>
        <h2>Extracted Text:</h2>
        <p>{extractedText}</p>
      </div>
    </div>
  );
};

export default PerformOCR;
