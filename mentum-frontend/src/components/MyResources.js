import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ResourceList.css';

function MyResources() {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMyResources = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/resources/my', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setResources(response.data.resources || []);
        } catch (error) {
            console.error('Error fetching my resources:', error);
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyResources();
    }, []);

    return (
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
                            <a href={resource.fileUrl} target="_blank" rel="noreferrer">
                                View Resource
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyResources;
