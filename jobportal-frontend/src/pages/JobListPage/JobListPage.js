import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../contexts/AuthContext';
import jobService from '../../services/jobService';
import applicationService from '../../services/applicationService'; 
import JobDetailsModal from '../Dashboard/JobSeeker/JobDetailsModal'; 
import './JobListPage.css';

const JobListPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [postError, setPostError] = useState('');

 
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [applicationCoverLetter, setApplicationCoverLetter] = useState('');
  const [isApplyFormOpen, setIsApplyFormOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');

  const indexOfLastJob = currentPage * jobsPerPage;
  const currentJobs = filteredJobs.slice(0, indexOfLastJob);
  const totalJobs = filteredJobs.length;
  const hasMoreJobs = currentJobs.length < totalJobs;

 
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
    setApplicationStatus(''); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setIsApplyFormOpen(false); 
    setApplicationCoverLetter(''); 
  };

  const handleOpenApplyForm = () => {
    
    if (!user) {
      navigate('/login', { state: { from: window.location.pathname, message: 'Please log in to apply for jobs.' } });
      return;
    }
    if (!user?.roles?.includes('ROLE_JOB_SEEKER')) {
        setApplicationStatus('Only Job Seekers can apply for jobs. Please register or log in as a Job Seeker.');
       
        return; 
    }
    setIsApplyFormOpen(true);
  
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob) {
        setApplicationStatus('Error: No job selected.');
        return;
    }
    if (!applicationCoverLetter.trim()) {
        setApplicationStatus('Please enter a cover letter.');
        return;
    }

    try {
        setLoading(true); 
        setApplicationStatus('Submitting application...');
        await applicationService.applyToJob({
            jobId: selectedJob.id,
            coverLetter: applicationCoverLetter,
        });
        setApplicationStatus('Application submitted successfully!');
        setTimeout(() => {
            handleCloseModal();
        }, 2000); 
    } catch (error) {
        console.error('Error submitting application:', error);
        setApplicationStatus(error.response?.data?.message || error.message || 'Failed to submit application.');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAndFilterJobs = async () => {
        try {
            setLoading(true);
           
            const searchParams = {
                keyword: searchTerm,
                location: locationFilter,
                jobType: typeFilter,
            };
            const data = await jobService.searchJobs(searchParams);
            setFilteredJobs(data || []);
            setCurrentPage(1); 
        } catch (error) {
            console.error('Error fetching or searching jobs:', error);
            setFilteredJobs([]); 
        } finally {
            setLoading(false);
        }
    };

    fetchAndFilterJobs();
  }, [searchTerm, locationFilter, typeFilter]); 

  const handlePostJob = () => {
    setPostError('');
    
    if (!user) {
      navigate('/login', { state: { from: '/post-job' } });
      return;
    }

    if (user?.roles?.includes('ROLE_EMPLOYER')) {
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
            <button className="btn-primary search-btn"> {/* Updated */}
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
              className="btn-text clear-filters" 
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
                  {user?.roles?.includes('ROLE_JOB_SEEKER') && ( 
                    <button
                      className="btn-secondary switch-role-btn" 
                      onClick={() => navigate('/register?role=employer')}
                    >
                      Register as Employer
                    </button>
                  )}
                  {!user && (
                    <>
                      <button
                        className="btn-secondary login-btn" 
                        onClick={() => navigate('/login')}
                      >
                        Existing Employer
                      </button>
                      <button
                        className="btn-secondary register-btn" 
                        onClick={() => navigate('/register?role=employer')}
                      >
                        New Employer Account
                      </button>
                    </>
                  )}
                </div>
              )}

              <button
                className="btn-primary post-job-btn" 
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
                    <p className="company">{job.employerName || 'N/A'}</p> {/* Updated company name */}
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
                    <button onClick={() => handleViewDetails(job)} className="btn-secondary details-btn"> {/* Updated */}
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {hasMoreJobs && (
                <div className="load-more-container">
                  <button
                    className="btn-primary load-more-btn" // Updated
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

      {/* Modal Rendering */}
      {isModalOpen && selectedJob && !isApplyFormOpen && (
        <JobDetailsModal
          job={selectedJob}
          onClose={handleCloseModal}
          onApply={handleOpenApplyForm} // This will open the cover letter form
        />
      )}

      {isModalOpen && selectedJob && isApplyFormOpen && (
        <div className="modal"> {/* Basic modal styling needed for this */}
          <div className="modal-content">
            <h3>Apply for {selectedJob.title}</h3>
            <textarea
              placeholder="Enter your cover letter..."
              value={applicationCoverLetter}
              onChange={(e) => setApplicationCoverLetter(e.target.value)}
              rows={10}
              style={{ width: '100%', marginBottom: '10px' }}
            />
            {applicationStatus && <p>{applicationStatus}</p>}
            <button onClick={handleSubmitApplication} disabled={loading} className="btn-primary"> {/* Updated */}
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
            <button onClick={() => setIsApplyFormOpen(false)} disabled={loading} className="btn-text"> {/* Updated */}
              Back to Details
            </button>
            <button onClick={handleCloseModal} disabled={loading} className="btn-text" style={{ color: '#ef4444' }}> {/* Updated */}
              Cancel Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListPage;