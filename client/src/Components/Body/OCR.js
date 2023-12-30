import React, {useState} from 'react';
import performOCR from './OCRUtil';

const PerformOCR = () => {
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
        </div>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleOCR}>upload</button>
        <div>
          <h2>Extracted Text:</h2>
          <p>{extractedText}</p>
        </div>
      </div>
    );
}

export default PerformOCR