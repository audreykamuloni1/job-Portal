import React from 'react';
import { Link, Outlet, useLocation, NavLink } from 'react-router-dom';
import '../../components/layout/DashboardLayout.css'; // Import the new CSS

const EmployerDashboard = () => {
    const location = useLocation();
    const isDashboardHome = location.pathname === '/dashboard/employer' || location.pathname === '/dashboard/employer/';

    return (
        <div className="dashboard-container">
            <div className="dashboard-nav">
                <h2>Employer Menu</h2>
                <nav> {/* Keep existing nav for semantic structure, ul/li will be styled by CSS */}
                    <ul>
                        <li><NavLink to="profile" className={({isActive}) => isActive ? "active" : ""}>Company Profile</NavLink></li>
                        <li><NavLink to="post-job" className={({isActive}) => isActive ? "active" : ""}>Post New Job</NavLink></li>
                        <li><NavLink to="manage-jobs" className={({isActive}) => isActive ? "active" : ""}>Manage Jobs & Applicants</NavLink></li>
                    </ul>
                </nav>
            </div>
            <div className="dashboard-content">
                {/* The h1 can be part of each sub-page, or a generic one here if desired */}
                {/* For this example, removing the generic h1 from here, assuming sub-pages have titles */}
                {isDashboardHome && (
                    <div>
                        <h1>Welcome, Employer!</h1>
                        <p>Select an option from the menu to manage your account and job postings.</p>
                        {/* You can add more summary widgets or quick links here */}
                    </div>
                )}
                <Outlet /> 
            </div>
        </div>
    );
};

export default EmployerDashboard;