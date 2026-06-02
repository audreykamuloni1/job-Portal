import React, { useState, useRef } from 'react';
import axios from 'axios';
import authService from '../../../services/authService';
import applicationService from '../../../services/applicationService';

const Profile = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    if (!resumeFile) {
      setUploadStatus('Please choose a file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', resumeFile);

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        '/api/resume/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setUploadStatus('Resume uploaded successfully!');
      fileInputRef.current.value = '';
    } catch (err) {
      setUploadStatus('Upload failed: ' + (err.response?.data || err.message));
    }
  };

  // Optional: Download the current resume
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('/api/resume/download', {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setUploadStatus('Failed to download current resume.');
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {/* ...other profile fields... */}
      <div>
        <h3>Upload/Update Resume (PDF, DOC, DOCX)</h3>
        <input type="file" accept=".pdf,.doc,.docx" ref={fileInputRef} onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Resume</button>
        <button onClick={handleDownload} style={{marginLeft: '10px'}}>Download Current Resume</button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    </div>
  );
};

export default Profile;