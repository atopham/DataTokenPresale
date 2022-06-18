import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingScreen from './Screens/LandingScreen';
import BuyTokens from './Screens/BuyTokens';


function App() {
  return (
<BrowserRouter>
    <div>
      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to="/landing"/>}/>
          <Route path="/landing" element={<LandingScreen/>}/>
          <Route path="/buytokens" element={<BuyTokens/>}/>
        </Routes>

      </main>
    </div>
</BrowserRouter>
  );
}

export default App;
