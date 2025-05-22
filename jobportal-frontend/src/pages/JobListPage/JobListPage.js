import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './JobListPage.css';

const JobListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [postError, setPostError] = useState('');

  const indexOfLastJob = currentPage * jobsPerPage;
  const currentJobs = filteredJobs.slice(0, indexOfLastJob);
  const totalJobs = filteredJobs.length;
  const hasMoreJobs = currentJobs.length < totalJobs;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Empty array to simulate new platform with no jobs
        const emptyJobs = [];
        
        setTimeout(() => {
          setJobs(emptyJobs);
          setFilteredJobs(emptyJobs);
          setLoading(false);
        }, 1000);

      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const filterJobs = () => {
      let results = jobs.filter(job => {
        const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             job.company?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = job.location?.toLowerCase().includes(locationFilter.toLowerCase());
        const matchesType = typeFilter ? job.type === typeFilter : true;
        
        return matchesSearch && matchesLocation && matchesType;
      });
      setFilteredJobs(results);
    };

    filterJobs();
  }, [jobs, searchTerm, locationFilter, typeFilter]);

  const handlePostJob = () => {
    setPostError('');
    
    if (!user) {
      navigate('/login', { state: { from: '/post-job' } });
      return;
    }

    if (user?.role === 'employer') {
      navigate('/dashboard/post-job');
    } else {
      setPostError('Job posting requires an employer account.');
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading opportunities...</p>
      </div>
    );
  }

  return (
    <div className="job-list-page">
      <div className="job-list-container">
        <div className="job-list-header">
          <h1>Malawi Job Opportunities</h1>
          <p>Find positions that match your skills</p>
        </div>

        <div className="job-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">
              <span role="img" aria-label="Search">🔍</span>
            </button>
          </div>

          <div className="filter-controls">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Regions</option>
              <option value="Lilongwe">Lilongwe</option>
              <option value="Blantyre">Blantyre</option>
              <option value="Mzuzu">Mzuzu</option>
              <option value="Remote">Remote</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>

            <button 
              className="clear-filters"
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setTypeFilter('');
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="job-results">
          {currentJobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🚀</div>
              <h3>Pioneer Malawi's Job Market</h3>
              <p>No listings yet - be the first employer to post opportunities!</p>

              {postError && (
                <div className="post-error">
                  <p>{postError}</p>
                  {user?.role === 'jobSeeker' && (
                    <button
                      className="switch-role-btn"
                      onClick={() => navigate('/register?role=employer')}
                    >
                      Register as Employer
                    </button>
                  )}
                  {!user && (
                    <>
                      <button
                        className="login-btn"
                        onClick={() => navigate('/login')}
                      >
                        Existing Employer
                      </button>
                      <button
                        className="register-btn"
                        onClick={() => navigate('/register?role=employer')}
                      >
                        New Employer Account
                      </button>
                    </>
                  )}
                </div>
              )}

              <button 
                className="post-job-btn"
                onClick={handlePostJob}
              >
                Launch First Job Listing
              </button>
            </div>
          ) : (
            <>
              {currentJobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="card-header">
                    <h3 className="job-title">{job.title}</h3>
                    <p className="company">{job.company}</p>
                    <div className="job-meta">
                      <span className="location">📍 {job.location}</span>
                      <span className="job-type">{job.type}</span>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="job-description">
                      {job.description?.length > 150 
                        ? `${job.description.substring(0, 150)}...` 
                        : job.description}
                    </p>
                  </div>
                  <div className="card-footer">
                    <Link to={`/jobs/${job.id}`} className="details-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}

              {hasMoreJobs && (
                <div className="load-more-container">
                  <button 
                    className="load-more-btn"
                    onClick={handleLoadMore}
                  >
                    Load More Opportunities
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListPage;