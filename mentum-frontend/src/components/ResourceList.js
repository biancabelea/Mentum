import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ResourceList.css';
import { useNavigate } from 'react-router-dom';

function ResourceList() {
    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/resources', {
                params: { search },
            });
            setResources(response.data.resources || []);
        } catch (error) {
            console.error('Error fetching resources:', error);
            setResources([]);
        } finally {
            setLoading(false);
        }
    };    

    useEffect(() => {
        fetchResources();
    }, [search]);

    const navigateToAddResource = () => {
        window.location.href = '/add-resource';
    };

    const navigateToMyResources = () => {
        window.location.href = '/resources/my';
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
            
            <div className="resources-title">All Resources</div>

            <input
                type="text"
                className="search-input"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <button className="my-resources-button" onClick={navigateToMyResources}>
                My Resources
            </button>

            {loading ? (
                <p className="loading-message">Loading resources...</p>
            ) : resources.length === 0 ? (
                <p className="no-resources-message">No resources found. Try adding one!</p>
            ) : (
                <div className="body-cards">
                    {resources.map((resource) => (
                        <div className="card" key={resource._id}>
                        <h3>{resource.title}</h3>
                        <p>{resource.description}</p>
                        <p>
                            <a className="uploaded-by"
                                href={`/user-profile/${resource.uploadedBy._id}`}
                            >
                                Uploaded by: {resource.uploadedBy.name}
                            </a>
                        </p>
                        <a className="view-resource" href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                            View Resource
                        </a>
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

export default ResourceList;
