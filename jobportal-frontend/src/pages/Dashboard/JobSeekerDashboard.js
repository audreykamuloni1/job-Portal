import React, { useState } from 'react';
import { FaSearch, FaClipboardList, FaUser } from 'react-icons/fa';
import BrowseJobs from './JobSeeker/BrowseJobs';
import Applications from './JobSeeker/Applications';
import Profile from './JobSeeker/Profile';
import './JobSeekerDashboard.css';

const JobSeekerDashboard = () => {
  const [tab, setTab] = useState('browse');
  return (
    <div className="jobseeker-dashboard">
      <aside className="dashboard-sidebar">
        <button className={tab==='browse' ? 'active' : ''} onClick={() => setTab('browse')}>
          <FaSearch /> Browse Jobs
        </button>
        <button className={tab==='applications' ? 'active' : ''} onClick={() => setTab('applications')}>
          <FaClipboardList /> My Applications
        </button>
        <button className={tab==='profile' ? 'active' : ''} onClick={() => setTab('profile')}>
          <FaUser /> Profile
        </button>
      </aside>
      <section className="dashboard-content">
        {tab === 'browse' && <BrowseJobs />}
        {tab === 'applications' && <Applications />}
        {tab === 'profile' && <Profile />}
      </section>
    </div>
  );
};

export default JobSeekerDashboard;