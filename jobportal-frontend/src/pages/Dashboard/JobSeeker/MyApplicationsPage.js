import React, { useState, useEffect, useContext } from 'react';
import applicationService from '../../../services/applicationService';
import { AuthContext } from '../../../contexts/AuthContext'; // For context if needed
import './MyApplicationsPage.css'; // For basic styling

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext); // Get user from AuthContext

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                setError('');
                // This service method was updated to call /api/applications/user/me
                const data = await applicationService.getApplicationsByUser(); 
                setApplications(data || []);
            } catch (err) {
                setError(err.message || 'Failed to fetch your applications. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) { // Ensure user context is available if needed for other reasons, though service handles auth
            fetchApplications();
        }
    }, [user]); // Re-fetch if user context changes, though typically not needed for this call

    if (loading) {
        return <p>Loading your applications...</p>;
    }

    return (
        <div className="my-applications-container">
            <h2>My Submitted Applications</h2>
            {error && <p className="error-message">{error}</p>}
            
            {applications.length === 0 && !loading && (
                <p>You haven't submitted any applications yet. <a href="/jobs">Find jobs</a> to apply for!</p>
            )}

            {applications.map(app => (
                <div key={app.id} className="application-summary-card">
                    <h3>{app.jobTitle}</h3>
                    {/* Backend ApplicationDTO includes:
                        id, coverLetter, applicationDate, status,
                        jobId, jobTitle, applicantId, applicantUsername 
                        We might want to add company name to JobDTO and have it in ApplicationDTO later.
                    */}
                    <p><strong>Applied on:</strong> {new Date(app.applicationDate).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> <span className={`status-${app.status?.toLowerCase()}`}>{app.status}</span></p>
                    {app.coverLetter && <p><strong>Your Cover Letter:</strong> {app.coverLetter}</p>}
                </div>
            ))}
        </div>
    );
};

export default MyApplicationsPage;
