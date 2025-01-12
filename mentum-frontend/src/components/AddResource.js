import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/');
  };

  const handleRadioChange = (e) => {
      setUseFileUpload(e.target.value === 'upload');
  };

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
          formDataObj.append('file', file);
      } else {
          formDataObj.append('fileUrl', formData.fileUrl);
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
          navigate('/resources/my');
      } catch (error) {
          console.error('Error adding resource:', error);
          setMessage('Failed to add resource.');
      }
  };

  return (
      <div>
          <nav className="navbar">
            <nav>
              <button onClick={handleLogout} className="nav-button">
                  Logout
              </button>
            </nav>
          </nav>
          <div className="body-resources">
              <form onSubmit={handleSubmit}>
                  <div className="title">Add Resource</div>
                  <label>Title:</label>
                  <input
                      type="text"
                      name="title"
                      placeholder="Resource Title"
                      value={formData.title}
                      onChange={handleChange}
                  />
                  <label>Description:</label>
                  <textarea
                      name="description"
                      placeholder="Resource Description"
                      value={formData.description}
                      onChange={handleChange}
                  ></textarea>
                  <div className="radio-group-container">
                      <div className="radio-group">
                          <div className="radio-option">
                              <input
                                  type="radio"
                                  id="upload"
                                  name="fileOption"
                                  value="upload"
                                  checked={useFileUpload}
                                  onChange={handleRadioChange}
                              />
                              <label htmlFor="upload">Upload File</label>
                          </div>
                          <div className="radio-option">
                              <input
                                  type="radio"
                                  id="url"
                                  name="fileOption"
                                  value="url"
                                  checked={!useFileUpload}
                                  onChange={handleRadioChange}
                              />
                              <label htmlFor="url">Provide File URL</label>
                          </div>
                      </div>
                  </div>
                  {useFileUpload ? (
                      <input
                          type="file"
                          onChange={handleFileChange}
                      />
                  ) : (
                      <input
                          type="text"
                          name="fileUrl"
                          placeholder="File URL"
                          value={formData.fileUrl}
                          onChange={handleChange}
                      />
                  )}
                  <button type="submit">Add Resource</button>
              </form>
              {message && <p>{message}</p>}
          </div>
      </div>
  );
}

export default AddResource;