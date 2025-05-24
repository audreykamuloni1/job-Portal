import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import '../../../components/layout/DashboardLayout.css'; // Import the common CSS

const JobSeekerDashboardLayout = () => {
    const location = useLocation();
    // Check if the current path is exactly the base job seeker dashboard path
    const isDashboardHome = location.pathname === '/dashboard/job-seeker' || location.pathname === '/dashboard/job-seeker/';

    return (
        <div className="dashboard-container">
            <div className="dashboard-nav">
                <h2>Job Seeker Menu</h2>
                <nav>
                    <ul>
                        {/* Use NavLink for active styling if you have an 'active' class in CSS */}
                        <li><NavLink to="profile" className={({isActive}) => isActive ? "active" : ""}>My Profile</NavLink></li>
                        <li><NavLink to="my-applications" className={({isActive}) => isActive ? "active" : ""}>My Applications</NavLink></li>
                        <li><NavLink to="/jobs" className={({isActive}) => isActive ? "active" : ""}>Browse Jobs</NavLink></li> {/* Link to public job listings */}
                    </ul>
                </nav>
            </div>
            <div className="dashboard-content">
                {isDashboardHome && (
                     <div>
                        <h1>Welcome, Job Seeker!</h1>
                        <p>Manage your profile, track your applications, or browse for new opportunities.</p>
                    </div>
                )}
                <Outlet />
            </div>
        </div>
    );
};

export default JobSeekerDashboardLayout;
