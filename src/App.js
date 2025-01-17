import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import SignUpPage from './Components/Pages/SignUpPage';
import LoginPage from './Components/Pages/Login';
import Profile from './Components/Pages/Profile';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Home />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
