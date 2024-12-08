import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Register';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<div>Login Page (To be implemented)</div>} />
    </Routes>
  );
}

export default App;
