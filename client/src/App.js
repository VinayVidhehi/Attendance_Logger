import React from 'react';
import Body from './Components/Body/Body';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';

import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <div className='main-app-container'>
      <Header />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/' element={<Body />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
