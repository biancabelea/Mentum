import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ResourceList.css';
import { useResources } from '../api/rest/useResources';
import { getComments, useAddComment } from '../api/rest/comments';

function ResourceList() {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { resources, loading } = useResources({ search });
    const { postComment } = useAddComment();
    const [commentInputs, setCommentInputs] = useState({});
    const [allComments, setAllComments] = useState({});
    const [visibleComments, setVisibleComments] = useState({});

    const token = localStorage.getItem('token');

    const loadComments = async (resourceId) => {
        const comments = await getComments(resourceId);
        setAllComments((prev) => ({ ...prev, [resourceId]: comments }));
    };

    const handleCommentChange = (resourceId, value) => {
        setCommentInputs((prev) => ({ ...prev, [resourceId]: value }));
    };

    const handleCommentSubmit = async (resourceId) => {
        const text = commentInputs[resourceId];
        if (!text?.trim()) return;
        await postComment({ resourceId, text, token });
        setCommentInputs((prev) => ({ ...prev, [resourceId]: '' }));
        loadComments(resourceId);
    };

    const toggleComments = async (resourceId) => {
        const isVisible = visibleComments[resourceId];
        if (!isVisible) await loadComments(resourceId);
        setVisibleComments((prev) => ({ ...prev, [resourceId]: !prev[resourceId] }));
    };

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
                                    <a className="uploaded-by" href={`/user-profile/${resource.uploadedBy._id}`}>
                                        Uploaded by: {resource.uploadedBy.name}
                                    </a>
                                </p>
                                <a
                                    className="view-resource"
                                    href={resource.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Resource
                                </a>

                                <a
                                    className="view-resource"
                                    style={{ marginTop: '0.5rem', display: 'inline-block', cursor: 'pointer' }}
                                    onClick={() => toggleComments(resource._id)}
                                >
                                    {visibleComments[resource._id] ? 'Hide Comments' : 'View Comments'}
                                </a>

                                {visibleComments[resource._id] && (
                                    <div className="comments-section">
                                        <h4>Comments</h4>
                                        {(allComments[resource._id] || []).map((comment) => (
                                            <div key={comment._id} className="comment">
                                                <strong>{comment.author?.name || 'Unknown'}:</strong> {comment.text}
                                            </div>
                                        ))}

                                        <input
                                            type="text"
                                            placeholder="Write a comment..."
                                            value={commentInputs[resource._id] || ''}
                                            onChange={(e) => handleCommentChange(resource._id, e.target.value)}
                                        />
                                        <button onClick={() => handleCommentSubmit(resource._id)}>Submit</button>
                                    </div>
                                )}
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
