import React, {useState} from 'react';
import SignInForm from './Signin';
import performOCR from '../OCRUtil';

const Body = () => {
    const [image, setImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
  
    const handleImageChange = (event) => {
      const file = event.target.files[0];
      setImage(file);
    };
  
    const handleOCR = async () => {
      if (!image) {
        console.error('No image selected');
        console.log("hi");
        return;
      }
  
      try {
        const text = await performOCR(image);
        setExtractedText(text);
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
        <button onClick={handleOCR}>Perform OCR</button>
        <div>
          <h2>Extracted Text:</h2>
          <p>{extractedText}</p>
        </div>
      </div>
    );
}

export default Body