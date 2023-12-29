import React, { useState } from 'react';
import SignInForm from './Signin';
import performOCR from '../OCRUtil';
import './ocr.css';

const Body = () => {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setIsFileUploaded(false); // Reset file uploaded state
  };

  const handleOCR = async () => {
    if (!image) {
      console.error('No image selected');
      return;
    }

    try {
      setIsLoading(true);

      const text = await performOCR(image);

      // Simulating a delay for the loading spinner (replace with actual backend call)
      setTimeout(() => {
        setIsLoading(false);
        setExtractedText(text);
        setIsFileUploaded(true); // Set file uploaded state
      }, 2000);
    } catch (error) {
      console.error('Error performing OCR:', error);
    }
  };

  return (
    <div>
      <div>
        <SignInForm />
      </div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleOCR} disabled={isLoading}>
        Perform OCR
      </button>
      {isLoading && <div>Loading...</div>}
      {isFileUploaded && <div>File uploaded</div>}
    </div>
  );
};

export default Body;
