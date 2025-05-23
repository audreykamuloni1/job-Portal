import React, { useState, useContext } from 'react';
import jobService from '../../../services/jobService';
import { AuthContext } from '../../../contexts/AuthContext'; // For context if needed
import { useNavigate } from 'react-router-dom'; // To redirect after successful post

const PostJobPage = () => {
    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        location: '',
        jobType: '', // e.g., Full-time, Part-time, Contract, Internship
        requirements: '',
        salary: '', // Optional
        applicationDeadline: '' // Consider using a date picker input type="date"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { user } = useContext(AuthContext); // For any employer specific context if needed
    const navigate = useNavigate();

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        if (!jobData.title || !jobData.description || !jobData.location || !jobData.jobType || !jobData.requirements) {
            setError('Please fill in all required fields: Title, Description, Location, Job Type, Requirements.');
            return;
        }
        
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            // Ensure applicationDeadline is in the correct format if sent as string
            // Backend expects ISO format like YYYY-MM-DDTHH:mm:ss, or just YYYY-MM-DD if only date.
            // If using <input type="date">, it gives YYYY-MM-DD. Append T00:00:00 if time is needed.
            let submissionData = { ...jobData };
            if (submissionData.applicationDeadline && submissionData.applicationDeadline.length === 10) { // YYYY-MM-DD
                submissionData.applicationDeadline = submissionData.applicationDeadline + 'T00:00:00';
            }
            
            await jobService.postJob(submissionData);
            setSuccessMessage('Job posted successfully! You will be redirected shortly.');
            // Clear form
            setJobData({
                title: '', description: '', location: '', jobType: '',
                requirements: '', salary: '', applicationDeadline: ''
            });
            setTimeout(() => {
                // Redirect to employer's job list page or dashboard main
                // For now, let's assume a route like '/dashboard/employer/my-jobs' will exist
                navigate('/dashboard/employer'); // Or to a page showing their jobs
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
                    <label htmlFor="salary">Salary (Optional, e.g., $50,000/year or Negotiable):</label>
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
