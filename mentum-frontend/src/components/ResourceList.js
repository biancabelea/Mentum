import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ResourceList() {
    const [resources, setResources] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/resources', {
                params: { search },
            });
            setResources(response.data.resources);
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [search]);

    return (
        <div>
            <h2>Resources</h2>
            <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {resources.map((resource) => (
                        <li key={resource._id}>
                            <h3>{resource.title}</h3>
                            <p>{resource.description}</p>
                            <a href={resource.fileUrl} target="_blank" rel="noreferrer">
                                View Resource
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ResourceList;
