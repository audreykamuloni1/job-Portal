import React, { useState, useEffect } from 'react';
import profileService from '../../../services/profileService';
import './JobSeekerProfilePage.css';

const JobSeekerProfilePage = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    contactPhone: '',
    skillsSummary: '',
    education: '',
    experience: '',
    resumeFilePath: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await profileService.getJobSeekerProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const updated = await profileService.updateJobSeekerProfile(profile);
      setProfile(updated);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResume = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setError('Please select a resume file to upload.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await profileService.uploadResume(resumeFile);
      let newFilePath = '';
      if (response && response.message) {
        const parts = response.message.split(': ');
        if (parts.length > 1) {
          newFilePath = parts[parts.length - 1].trim();
        }
        setSuccessMessage(response.message);
      } else {
        setSuccessMessage('Resume uploaded successfully!');
      }
      setProfile(prev => ({ ...prev, resumeFilePath: newFilePath || prev.resumeFilePath }));
      setResumeFile(null);
    } catch (err) {
      setError(err.message || 'Failed to upload resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.fullName) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-page-container">
      <div className="container">
        <h2 style={{ textAlign: 'center' }}>My Profile</h2>
        {error && <p className="message-error">{error}</p>}
        {successMessage && <p className="message-success">{successMessage}</p>}

        <form onSubmit={handleSubmitProfile} className="profile-form">
          <h3>Update Your Information</h3>
          <div>
            <label htmlFor="fullName">Full Name:</label>
            <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="contactPhone">Contact Phone:</label>
            <input type="text" name="contactPhone" value={profile.contactPhone} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="skillsSummary">Skills Summary:</label>
            <textarea name="skillsSummary" value={profile.skillsSummary} onChange={handleChange}></textarea>
          </div>
          <div>
            <label htmlFor="education">Education:</label>
            <textarea name="education" value={profile.education} onChange={handleChange}></textarea>
          </div>
          <div>
            <label htmlFor="experience">Experience:</label>
            <textarea name="experience" value={profile.experience} onChange={handleChange}></textarea>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        <hr />

        <form onSubmit={handleSubmitResume} className="profile-form">
          <h3>Resume</h3>
          {profile.resumeFilePath && (
            <p className="current-resume-info">Current resume: {profile.resumeFilePath}</p>
          )}
          <div>
            <label htmlFor="resume">Upload new resume (PDF, DOCX):</label>
            <input type="file" name="resume" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
          </div>
          <button type="submit" className="btn-primary" disabled={loading || !resumeFile}>
            {loading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobSeekerProfilePage;