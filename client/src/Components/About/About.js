import React from 'react';
import './About.css';
import ash from '../../images/img2.webp';
import spoo from '../../images/img3.jpg';
import vi from '../../images/img1.jpeg';

const About = () => {
  return (
    <div className="about-container">
      <h2>About Us</h2>
      <div className='about-profile-container'>
      <div className="about-section">
        <img src={ash} alt="Ashish" />
        <p>Ashish</p>
      </div>
      <div className="about-section">
        <img src={spoo} alt="Spoorthi" />
        <p>Spoorthi</p>
      </div>
      <div className="about-section">
        <img src={vi} alt="Vinay" />
        <p>Vinay</p>
      </div>
      </div>
    </div>
  );
};

export default About;
