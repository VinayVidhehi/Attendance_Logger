// App.js

import React from 'react';
import Body from './Components/Body/Body';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
//import About from './Components/About/About';

const App = () => {
  return (
    <div className='main-app-container'>
      <Header />
      <Body />
    { /* <About /> */}
      <Footer />
    </div>
  )
};

export default App;
