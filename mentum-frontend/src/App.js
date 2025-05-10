import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import Register from './components/Register';
import Login from './components/Login';
import AddResource from './components/AddResource';
import ResourceList from './components/ResourceList';
import MyResources from './components/MyResources';
import ContactMentor from './components/ContactMentor';
import SearchMentor from './components/SearchMentor';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add-resource" element={<AddResource />} />
                <Route path="/resources" element={<ResourceList />} />
                <Route path="/resources/my" element={<MyResources />} />
                <Route path="/contact-mentor" element={<ContactMentor />} />
                <Route path="/mentors-search" element={<SearchMentor />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/user-profile/:id" element={<UserProfile />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
