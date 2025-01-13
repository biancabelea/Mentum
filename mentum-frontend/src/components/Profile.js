import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setUserData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (loading) return <p>Loading...</p>;

    if (!userData) return <p>Error loading profile data.</p>;

    return (
        <div className="profile">
        <div className="profile-page">
            <h1>{userData.name}'s Profile</h1>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.userRole}</p>
            <p><strong>University Year:</strong> {userData.userYear}</p>

            {userData.userRole === 'Mentor' && (
                <p><strong>Skills:</strong> {userData.skills.join(', ')}</p>
            )}

            <h2>Uploaded Resources</h2>
            {userData.resources.length > 0 ? (
                <ul className="resources-list">
                {userData.resources.map((resource, index) => (
                    <li key={index}>
                        <h3>{resource.title}</h3>
                        <p>{resource.description}</p>
                        <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                            View Resource
                        </a>
                    </li>
                ))}
            </ul>            
            ) : (
                <p>No uploaded resources.</p>
            )}
        </div>
        </div>
    );
};

export default Profile;
