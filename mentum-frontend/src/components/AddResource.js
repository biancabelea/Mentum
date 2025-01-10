import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddResource.css';

function AddResource() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        fileUrl: '',
    });
    const [file, setFile] = useState(null);
    const [useFileUpload, setUseFileUpload] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formDataObj = new FormData();
        formDataObj.append('title', formData.title);
        formDataObj.append('description', formData.description);
    
        if (useFileUpload) {
            formDataObj.append('file', file); // Attach the file
        } else {
            formDataObj.append('fileUrl', formData.fileUrl); // Attach the file URL
        }
    
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('You are not logged in. Please log in again.');
                return;
            }
    
            const response = await axios.post('http://localhost:5000/resources', formDataObj, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Resource added successfully!');
        } catch (error) {
            console.error('Error adding resource:', error);
            setMessage('Failed to add resource.');
        }
    };    

    return (
        <div className="body-resources">
            <form onSubmit={handleSubmit}>
                <h2 className="title">Add Resource</h2>
                {message && <p>{message}</p>}

                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Resource Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Resource Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                ></textarea>

                <div className="radio-group-container">
                    <div className="radio-group">
                        <div className="radio-option">
                            <input
                                type="radio"
                                id="upload-file"
                                name="uploadOption"
                                value="file"
                                checked={useFileUpload}
                                onChange={() => setUseFileUpload(true)}
                            />
                            <label htmlFor="upload-file">Upload File</label>
                        </div>

                        <div className="radio-option">
                            <input
                                type="radio"
                                id="file-url"
                                name="uploadOption"
                                value="url"
                                checked={!useFileUpload}
                                onChange={() => setUseFileUpload(false)}
                            />
                            <label htmlFor="file-url">Provide File URL</label>
                        </div>
                    </div>
                </div>

                {useFileUpload ? (
                    <input type="file" onChange={handleFileChange} accept=".pdf" required />
                ) : (
                    <input
                        type="url"
                        name="fileUrl"
                        placeholder="File URL"
                        value={formData.fileUrl}
                        onChange={handleChange}
                        required
                    />
                )}

                <button type="submit">Add Resource</button>
            </form>
        </div>
    );
}

export default AddResource;
