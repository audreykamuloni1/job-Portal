import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext'; // Corrected import
import profileService from '../../../services/profileService';
import applicationService from '../../../services/applicationService';
import jobService from '../../../services/jobService';
import './JobSeekerHome.css'; // For styling this specific page

const JobSeekerHome = () => {
    const { user } = useAuth(); // Get user from AuthContext
    const [profileSummary, setProfileSummary] = useState(null);
    const [recentApplications, setRecentApplications] = useState([]);
    const [latestJobs, setLatestJobs] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingApplications, setLoadingApplications] = useState(true);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfileSummary = async () => {
            try {
                const data = await profileService.getJobSeekerProfile();
                setProfileSummary(data);
            } catch (err) {
                console.error("Error fetching profile summary:", err);
                setError(prev => prev + 'Failed to load profile summary. ');
            } finally {
                setLoadingProfile(false);
            }
        };

        const fetchRecentApplications = async () => {
            try {
                const data = await applicationService.getApplicationsByUser();
                setRecentApplications(data.slice(0, 3)); // Display latest 3
            } catch (err) {
                console.error("Error fetching recent applications:", err);
                setError(prev => prev + 'Failed to load recent applications. ');
            } finally {
                setLoadingApplications(false);
            }
        };

        const fetchLatestJobs = async () => {
            try {
                const data = await jobService.getAllJobs(); // Public, approved jobs
                setLatestJobs(data.slice(0, 3)); // Display latest 3
            } catch (err) {
                console.error("Error fetching latest jobs:", err);
                setError(prev => prev + 'Failed to load latest jobs. ');
            } finally {
                setLoadingJobs(false);
            }
        };

        if (user) {
            fetchProfileSummary();
            fetchRecentApplications();
            fetchLatestJobs();
        }
    }, [user]);

    return (
        <div className="jobseeker-home-container">
            {error && <p className="error-message">{error.trim()}</p>}
            
            <div className="dashboard-grid">
                {/* Left Panel: Profile Summary */}
                <section className="profile-summary-panel card"> {/* Using .card from DashboardLayout.css */}
                    <h3>Profile Summary</h3>
                    {loadingProfile ? <p>Loading profile...</p> : profileSummary ? (
                        <>
                            <h4>{profileSummary.fullName || user?.username}</h4>
                            <p>{profileSummary.email || user?.email}</p>
                            <p>{profileSummary.contactPhone || 'No phone provided'}</p>
                            <p>Skills: {profileSummary.skillsSummary || 'Not specified'}</p>
                            <Link to="profile" className="dashboard-button">Edit Profile</Link>
                            {/* Resume upload is part of the profile page */}
                            <Link to="profile" className="dashboard-button">Upload/View Resume</Link>
                        </>
                    ) : <p>Could not load profile summary.</p>}
                </section>

                {/* Center Panel: Recent Applications */}
                <section className="recent-applications-panel card">
                    <h3>Recent Applications</h3>
                    {loadingApplications ? <p>Loading applications...</p> : recentApplications.length > 0 ? (
                        <ul>
                            {recentApplications.map(app => (
                                <li key={app.id}>
                                    <Link to={`/jobs/${app.jobId}`}><strong>{app.jobTitle}</strong></Link>
                                    <p>Status: <span className={`status-${app.status?.toLowerCase()}`}>{app.status}</span></p>
                                    <small>Applied: {new Date(app.applicationDate).toLocaleDateString()}</small>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No recent applications found.</p>}
                    {recentApplications.length > 0 && <Link to="my-applications" className="dashboard-button-secondary">View All Applications</Link>}
                </section>

                {/* Right Panel: Recommended/Latest Jobs */}
                <section className="latest-jobs-panel card">
                    <h3>Latest Job Postings</h3>
                    {loadingJobs ? <p>Loading jobs...</p> : latestJobs.length > 0 ? (
                        <ul>
                            {latestJobs.map(job => (
                                <li key={job.id}>
                                    <Link to={`/jobs/${job.id}`}><strong>{job.title}</strong></Link>
                                    <p>{job.employerName || 'N/A'}</p>
                                    <small>{job.location}</small>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No jobs found currently.</p>}
                     {latestJobs.length > 0 && <Link to="/jobs" className="dashboard-button-secondary">Browse All Jobs</Link>}
                </section>
            </div>
        </div>
    );
};

export default JobSeekerHome;
