import React, { useState, useEffect, useContext } from 'react'; // useContext will be removed if not used elsewhere
import profileService from '../../../services/profileService';
import { useAuth } from '../../../contexts/AuthContext'; // To get user info if needed for context
import './JobSeekerProfilePage.css'; // Import CSS

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
    const { user } = useAuth(); // Get user from useAuth

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
            const response = await profileService.uploadResume(resumeFile); // response is an object like { message: "..." }
            let newFilePath = '';
            if (response && response.message) {
                // Assuming the message format "Resume uploaded successfully: filename.ext"
                const parts = response.message.split(': ');
                if (parts.length > 1) {
                    newFilePath = parts[parts.length - 1].trim(); // Get the last part after ": "
                }
                setSuccessMessage(response.message); // Keep the full success message for display
            } else {
                // Fallback or error if message format is unexpected
                setSuccessMessage('Resume uploaded successfully!'); // Generic success
            }
            setProfile(prevProfile => ({ ...prevProfile, resumeFilePath: newFilePath || prevProfile.resumeFilePath })); // Update with new path or keep old if extraction fails
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
        <div className="profile-page-container">
            <div className="container">
                <h2>My Profile</h2>
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
