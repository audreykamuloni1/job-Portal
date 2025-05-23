import React, { useState, useEffect, useCallback } from 'react';
import jobService from '../../../services/jobService';
import applicationService from '../../../services/applicationService';
import './ManageJobsPage.css'; // For basic styling

const ManageJobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingApplications, setLoadingApplications] = useState(false);
    const [error, setError] = useState('');

    const fetchEmployerJobs = useCallback(async () => {
        try {
            setLoadingJobs(true);
            setError('');
            const data = await jobService.getEmployerJobs();
            setJobs(data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch jobs.');
            console.error(err);
        } finally {
            setLoadingJobs(false);
        }
    }, []);

    useEffect(() => {
        fetchEmployerJobs();
    }, [fetchEmployerJobs]);

    const handleViewApplicants = async (job) => {
        setSelectedJob(job);
        try {
            setLoadingApplications(true);
            setError('');
            const data = await applicationService.getApplicationsByJob(job.id);
            setApplications(data || []);
        } catch (err) {
            setError(err.message || `Failed to fetch applications for ${job.title}.`);
            console.error(err);
            setApplications([]); // Clear previous applications on error
        } finally {
            setLoadingApplications(false);
        }
    };

    const handleUpdateStatus = async (applicationId, newStatus) => {
        try {
            setError(''); // Clear previous errors
            // Optionally, add a confirmation dialog here
            await applicationService.updateApplicationStatus(applicationId, newStatus);
            // Refresh applications for the selected job
            setApplications(prevApplications => 
                prevApplications.map(app => 
                    app.id === applicationId ? { ...app, status: newStatus } : app
                )
            );
            alert(`Application status updated to ${newStatus}.`); // Simple feedback
        } catch (err) {
            setError(err.message || 'Failed to update application status.');
            console.error(err);
        }
    };

    if (loadingJobs) {
        return <p>Loading your job postings...</p>;
    }

    return (
        <div className="manage-jobs-container">
            <h2>Manage Your Job Postings</h2>
            {error && <p className="error-message">{error}</p>}

            <div className="jobs-list-panel">
                <h3>Your Jobs</h3>
                {jobs.length === 0 && !loadingJobs && <p>You haven't posted any jobs yet.</p>}
                <ul>
                    {jobs.map(job => (
                        <li key={job.id} className={selectedJob?.id === job.id ? 'selected' : ''}>
                            <h4>{job.title}</h4>
                            <p>{job.location} - {job.jobType}</p>
                            <p>Status: {job.status}</p> 
                            <button onClick={() => handleViewApplicants(job)} disabled={loadingApplications}>
                                {loadingApplications && selectedJob?.id === job.id ? 'Loading...' : 'View Applicants'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedJob && (
                <div className="applications-panel">
                    <h3>Applicants for {selectedJob.title}</h3>
                    {loadingApplications && <p>Loading applications...</p>}
                    {!loadingApplications && applications.length === 0 && <p>No applications yet for this job.</p>}
                    
                    {applications.map(app => (
                        <div key={app.id} className="application-card">
                            <p><strong>Applicant:</strong> {app.applicantUsername}</p>
                            <p><strong>Applied on:</strong> {new Date(app.applicationDate).toLocaleDateString()}</p>
                            <p><strong>Cover Letter:</strong> {app.coverLetter || 'N/A'}</p>
                            <p><strong>Current Status:</strong> {app.status}</p>
                            <div className="status-actions">
                                <label>Change Status: </label>
                                <select 
                                    value={app.status} 
                                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="APPROVED">Approve (Shortlist)</option>
                                    <option value="REJECTED">Reject</option>
                                </select>
                                {/* Or use buttons:
                                <button onClick={() => handleUpdateStatus(app.id, 'APPROVED')} disabled={app.status === 'APPROVED'}>Approve</button>
                                <button onClick={() => handleUpdateStatus(app.id, 'REJECTED')} disabled={app.status === 'REJECTED'}>Reject</button> 
                                */}
                            </div>
                            {/* TODO: Link to applicant's full profile/resume if available */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageJobsPage;
