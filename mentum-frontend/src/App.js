import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import Register from './components/Register';
import Login from './components/Login';
import AddResource from './components/AddResource';
import ResourceList from './components/ResourceList';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-resource" element={<AddResource />} />
            <Route path="/resources" element={<ResourceList />} />
        </Routes>
    );
}

export default App;
