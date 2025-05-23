import React, { useState, useEffect, useContext } from 'react';
import profileService from '../../../services/profileService';
import { AuthContext }
from '../../../contexts/AuthContext'; // To get user info if needed for context

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { user } = useContext(AuthContext); // Get user from AuthContext

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await profileService.getJobSeekerProfile();
                if (data) {
                    setProfile({
                        fullName: data.fullName || '',
                        contactPhone: data.contactPhone || '',
                        skillsSummary: data.skillsSummary || '',
                        education: data.education || '',
                        experience: data.experience || '',
                        resumeFilePath: data.resumeFilePath || ''
                    });
                }
            } catch (err) {
                setError(err.message || 'Failed to fetch profile. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            setSuccessMessage('');
            await profileService.updateJobSeekerProfile(profile);
            setSuccessMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.message || 'Failed to update profile. Please try again.');
            console.error(err);
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
        try {
            setLoading(true);
            setError('');
            setSuccessMessage('');
            const response = await profileService.uploadResume(resumeFile);
            setProfile(prevProfile => ({ ...prevProfile, resumeFilePath: response.fileName || response.message })); // Assuming backend returns filename in 'fileName' or 'message'
            setSuccessMessage(response.message || 'Resume uploaded successfully!');
            setResumeFile(null); // Clear file input
        } catch (err) {
            setError(err.message || 'Failed to upload resume. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !profile.fullName) { // Show loading only on initial load
        return <p>Loading profile...</p>;
    }

    return (
        <div>
            <h2>My Profile</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            <form onSubmit={handleSubmitProfile}>
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
                <button type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>

            <hr />

            <form onSubmit={handleSubmitResume}>
                <h3>Resume</h3>
                {profile.resumeFilePath && (
                    <p>Current resume: {profile.resumeFilePath}
                       {/* Optional: Add a link to download if backend serves files */}
                    </p>
                )}
                <div>
                    <label htmlFor="resume">Upload new resume (PDF, DOCX):</label>
                    <input type="file" name="resume" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                </div>
                <button type="submit" disabled={loading || !resumeFile}>
                    {loading ? 'Uploading...' : 'Upload Resume'}
                </button>
            </form>
        </div>
    );
};

export default JobSeekerProfilePage;
