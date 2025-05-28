import React from 'react';
import { useUserProfile } from '../api/rest/useUserProfile';
import '../styles/Profile.css';

const Profile = () => {
    const { userData, loading } = useUserProfile();

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

                {userData.userRole === 'Mentor' && (
                    <button
                        className="availability-button"
                        onClick={() => window.location.href = '/mentor/availability'}
                    >
                        Manage Availability
                    </button>
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
