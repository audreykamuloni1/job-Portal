import React, { useState } from 'react';
import jobService from '../../../services/jobService';
import { useAuth } from '../../../contexts/AuthContext'; // Use the custom hook
import { useNavigate } from 'react-router-dom';

const PostJobPage = () => {
    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        location: '',
        jobType: '',
        requirements: '',
        salary: '',
        applicationDeadline: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { user } = useAuth(); // Use the hook, not useContext(AuthContext)
    const navigate = useNavigate();

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!jobData.title || !jobData.description || !jobData.location || !jobData.jobType || !jobData.requirements) {
            setError('Please fill in all required fields: Title, Description, Location, Job Type, Requirements.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            let submissionData = { ...jobData };
            if (submissionData.applicationDeadline && submissionData.applicationDeadline.length === 10) {
                submissionData.applicationDeadline = submissionData.applicationDeadline + 'T00:00:00';
            }

            await jobService.postJob(submissionData);
            setSuccessMessage('Job posted successfully! You will be redirected shortly.');
            setJobData({
                title: '', description: '', location: '', jobType: '',
                requirements: '', salary: '', applicationDeadline: ''
            });
            setTimeout(() => {
                navigate('/dashboard/employer');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to post job. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Post a New Job</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Job Title *:</label>
                    <input type="text" name="title" value={jobData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="location">Location *:</label>
                    <input type="text" name="location" value={jobData.location} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="jobType">Job Type * (e.g., Full-time, Part-time):</label>
                    <input type="text" name="jobType" value={jobData.jobType} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="description">Description *:</label>
                    <textarea name="description" value={jobData.description} onChange={handleChange} rows="5" required></textarea>
                </div>
                <div>
                    <label htmlFor="requirements">Requirements *:</label>
                    <textarea name="requirements" value={jobData.requirements} onChange={handleChange} rows="3" required></textarea>
                </div>
                <div>
                    <label htmlFor="salary">Salary (Optional, e.g., MWK500,000/month or Negotiable):</label>
                    <input type="text" name="salary" value={jobData.salary} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="applicationDeadline">Application Deadline (YYYY-MM-DD):</label>
                    <input type="date" name="applicationDeadline" value={jobData.applicationDeadline} onChange={handleChange} />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Posting Job...' : 'Post Job'}
                </button>
            </form>
        </div>
    );
};

export default PostJobPage;