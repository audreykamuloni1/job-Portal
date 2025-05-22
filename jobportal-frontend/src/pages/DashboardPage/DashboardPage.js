import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  // Employer state
  const [postedJobs, setPostedJobs] = useState([]);
  const [applicationsReceived, setApplicationsReceived] = useState([]);
  
  // Job Seeker state
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulated loading for new platform
        setTimeout(() => {
          if (user?.role === 'employer') {
            setPostedJobs([]);
            setApplicationsReceived([]);
          } else {
            setApplications([]);
            setSavedJobs([]);
          }
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Dashboard error:', error);
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderTopBar = () => (
    <div className="dashboard-top-bar">
      <div className="dashboard-branding">
        <h2>{user?.role === 'employer' ? user.company : user.name}</h2>
        <p>{user?.role === 'employer' ? 'Company Dashboard' : 'Job Seeker Dashboard'}</p>
      </div>
      <button onClick={handleLogout} className="btn-logout">
        Log Out
      </button>
    </div>
  );

  const renderEmployerDashboard = () => (
    <div className="dashboard-container">
      {renderTopBar()}
      
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Manage Job Postings</h1>
          <p>Create and monitor employment opportunities</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/dashboard/post-job" className="btn-primary">
            Post New Job
          </Link>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-content">
            <div className="stat-number">{postedJobs.length}</div>
            <div className="stat-label">Active Listings</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📨</div>
          <div className="stat-content">
            <div className="stat-number">{applicationsReceived.length}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}>
          Job Postings
        </button>
        <button className={`tab-button ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}>
          Applications
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Recent Activity</h3>
                </div>
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No Recent Activity</h3>
                  <p>Your recent job postings and applications will appear here</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderJobSeekerDashboard = () => (
    <div className="dashboard-container">
      {renderTopBar()}
      
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Job Search Tracker</h1>
          <p>Manage your applications and saved positions</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-number">{applications.length}</div>
            <div className="stat-label">Applications</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <div className="stat-number">{savedJobs.length}</div>
            <div className="stat-label">Saved Jobs</div>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`tab-button ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}>
          Applications
        </button>
        <button className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}>
          Saved Jobs
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="quick-actions">
              <h3>Get Started</h3>
              <div className="actions-grid">
                <Link to="/jobs" className="action-card">
                  <div className="action-icon">🔍</div>
                  <div className="action-content">
                    <h4>Search Jobs</h4>
                    <p>Find new opportunities</p>
                  </div>
                </Link>
                <Link to="/profile" className="action-card">
                  <div className="action-icon">📄</div>
                  <div className="action-content">
                    <h4>Update Resume</h4>
                    <p>Upload your latest CV</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {user?.role === 'employer' ? renderEmployerDashboard() : renderJobSeekerDashboard()}
    </div>
  );
};

export default DashboardPage;