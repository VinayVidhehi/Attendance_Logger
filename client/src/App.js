import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Body from './Components/Body/Body';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import Staff from './Components/Staff/Staff';
import CourseDetails from './Components/Staff/CourseDetails';
import Student from './Components/Student/Student';
import PerformOCR from './Components/Body/OCR';
import AttandanceStaffview from './Components/Staff/AttandanceStaffview';
import CertificateDisplay from './Components/Staff/CertificateDisplay';

const App = () => {
  return (
    <div className='main-app-container'>
      <Header />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/student' element={<Student />} />
        <Route path='/staff' element={<Staff />} />
        <Route path='/staff/attendance-staffview' element={<AttandanceStaffview />} />
        <Route path='/' element={<Body />} />
        <Route path='/staff/course-details' element={<CourseDetails />} />
        <Route path='/staff/certificate-display' element={<CertificateDisplay />} />
        <Route path='/staff/OCR' element={<PerformOCR />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
