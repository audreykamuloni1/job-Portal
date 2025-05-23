import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
// import './EmployerDashboard.css'; // Optional: for styling

const EmployerDashboard = () => {
    const location = useLocation();

    // Basic check to see if we are on the main /dashboard/employer path
    const isDashboardHome = location.pathname === '/dashboard/employer' || location.pathname === '/dashboard/employer/';

    return (
        <div>
            <h1>Employer Dashboard</h1>
            <nav>
                <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', gap: '10px' }}>
                    <li><Link to="profile">Company Profile</Link></li>
                    <li><Link to="post-job">Post New Job</Link></li>
                    <li><Link to="manage-jobs">Manage Jobs & Applicants</Link></li>
                </ul>
            </nav>
            <hr />
            
            {isDashboardHome && (
                <div>
                    <p>Welcome to your dashboard. Please select an option from the menu above to get started.</p>
                    {/* Or render some default dashboard widgets/summary here */}
                </div>
            )}
            <Outlet /> 
        </div>
    );
};

export default EmployerDashboard;