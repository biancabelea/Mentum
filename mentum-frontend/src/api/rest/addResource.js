import axios from 'axios';

export async function addResource({ title, description, file, fileUrl, useFileUpload }) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);

  if (useFileUpload) {
    formData.append('file', file);
  } else {
    formData.append('fileUrl', fileUrl);
  }

  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const response = await axios.post('http://localhost:5000/resources', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
