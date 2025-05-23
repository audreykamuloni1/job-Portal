import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jobService from '../../../services/jobService';
import applicationService from '../../../services/applicationService'; // Ensure this is the correct path and service name
import './EmployerHome.css'; // For styling this specific page

const EmployerHome = () => {
    const [totalJobsPosted, setTotalJobsPosted] = useState(0);
    const [activeListings, setActiveListings] = useState(0);
    const [recentApplicants, setRecentApplicants] = useState([]);
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    const [loadingApplicants, setLoadingApplicants] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const totalJobs = await jobService.getTotalJobsPostedMetric();
                const activeJobs = await jobService.getActiveJobsMetric();
                setTotalJobsPosted(totalJobs);
                setActiveListings(activeJobs);
            } catch (err) {
                console.error("Error fetching job metrics:", err);
                setError(prev => prev + 'Failed to load job metrics. ');
            } finally {
                setLoadingMetrics(false);
            }
        };

        const fetchRecentApplicants = async () => {
            try {
                // The backend controller for /api/applications/employer/recent has a @RequestParam(defaultValue = "5") int limit
                // So calling it without params will use the default limit.
                const data = await applicationService.getRecentApplicationsForEmployer(); 
                setRecentApplicants(data.slice(0, 5)); // Ensure frontend also respects a limit if backend returns more than desired for this view
            } catch (err) {
                console.error("Error fetching recent applicants:", err);
                setError(prev => prev + 'Failed to load recent applicants. ');
            } finally {
                setLoadingApplicants(false);
            }
        };

        fetchMetrics();
        fetchRecentApplicants();
    }, []);

    return (
        <div className="employer-home-container">
            {error && <p className="error-message">{error.trim()}</p>}

            <div className="dashboard-metrics">
                <div className="metric-card card"> {/* Using .card from DashboardLayout.css */}
                    <h4>Total Jobs Posted</h4>
                    {loadingMetrics ? <p>Loading...</p> : <p className="metric-value">{totalJobsPosted}</p>}
                </div>
                <div className="metric-card card">
                    <h4>Active Listings</h4>
                    {loadingMetrics ? <p>Loading...</p> : <p className="metric-value">{activeListings}</p>}
                </div>
            </div>

            <section className="recent-applicants-panel card">
                <h3>Recent Applicants</h3>
                {loadingApplicants ? <p>Loading applicants...</p> : recentApplicants.length > 0 ? (
                    <ul>
                        {recentApplicants.map(app => (
                            <li key={app.applicationId}>
                                <Link to={`/dashboard/employer/manage-jobs`}> {/* Or a direct link to the applicant view if possible */}
                                    <strong>{app.applicantUsername}</strong> applied for <strong>{app.jobTitle}</strong>
                                </Link>
                                <p>Applied on: {new Date(app.applicationDate).toLocaleDateString()}</p>
                                {app.status && <p>Status: <span className={`status-${app.status.toLowerCase()}`}>{app.status}</span></p>}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recent applicants found.</p>
                )}
                {recentApplicants.length > 0 && 
                    <Link to="manage-jobs" className="dashboard-button-secondary">View All Applicants</Link>}
            </section>
        </div>
    );
};

export default EmployerHome;
