// OCRUtil.js

import Tesseract from 'tesseract.js';

const performOCR = (imageFile) => {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      imageFile,
      'eng', // Specify language ('eng' for English)
      //{ logger: (info) => console.log(info) }
    )
      .then(({ data: { text } }) => {
        console.log("text is",text);
        resolve(text);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default performOCR;
