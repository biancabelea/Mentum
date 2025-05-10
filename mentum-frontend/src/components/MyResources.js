import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/ResourceList.css';
import { useResources } from '../api/rest/useResources';
import axios from 'axios';

function MyResources() {
    const navigate = useNavigate();
    const { resources, loading } = useResources({ my: true });

    const navigateToAddResource = () => {
        window.location.href = '/add-resource';
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:5000/resources/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert('Resource deleted successfully');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting resource:', error);
            alert('Failed to delete the resource');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <nav className="navbar">
                <div>
                    <button onClick={handleLogout} className="nav-button">
                        Logout
                    </button>
                </div>
            </nav>
            <div className="resources-page">
                <div className="resources-title">My Resources</div>

                {loading ? (
                    <p className="loading-message">Loading your resources...</p>
                ) : resources.length === 0 ? (
                    <p className="no-resources-message">You haven't uploaded any resources yet!</p>
                ) : (
                    <div className="body-cards">
                        {resources.map((resource) => (
                            <div className="card" key={resource._id}>
                                <h3>{resource.title}</h3>
                                <p>{resource.description}</p>
                                <p className="uploaded-by">
                                    Uploaded by: {resource.uploadedBy?.name || 'Unknown'}
                                </p>
                                <a href={resource.fileUrl} target="_blank" rel="noreferrer">
                                    View Resource
                                </a>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(resource._id)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <button className="add-button" onClick={navigateToAddResource}>
                    +
                </button>
            </div>
        </div>
    );
}

export default MyResources;
