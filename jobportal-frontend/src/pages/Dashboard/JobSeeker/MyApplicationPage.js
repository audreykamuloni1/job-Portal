import React, { useState, useEffect } from 'react'; // Removed useContext
import { Link } from 'react-router-dom'; // Ensure Link is imported
import applicationService from '../../../services/applicationService';
import { useAuth } from '../../../contexts/AuthContext'; // Corrected import
import './MyApplicationPage.css'; // Corrected CSS import name

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth(); // Corrected usage

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
            <div className="container"> {/* New wrapper */}
                <h2>My Submitted Applications</h2>
                {error && <p className="error-message">{error}</p>}

                {applications.length === 0 && !loading && (
                    <div className="no-applications-message text-center">
                        <p>You haven't submitted any applications yet. Start exploring opportunities now!</p>
                        <Link to="/jobs" className="btn-primary btn-small" style={{ marginTop: '1rem' }}>Find jobs</Link>
                    </div>
                )}

                {applications.length > 0 && !loading && (
                    <table className="applications-table">
                        <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Application Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app.id}>
                                    <td>
                                        <Link to={`/jobs/${app.jobId}`}>{app.jobTitle}</Link>
                                    </td>
                                    <td>{app.companyName || 'N/A'}</td>
                                    <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
                                    <td><span className={`status-${app.status?.toLowerCase()}`}>{app.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MyApplicationsPage;
