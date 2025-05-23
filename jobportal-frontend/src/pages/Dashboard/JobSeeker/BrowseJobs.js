import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobDetailsModal from './JobDetailsModal';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/jobs/search', { params });
      setJobs(res.data);
    } catch (err) {
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs({ keyword, location, jobType });
  };

  return (
    <div>
      <h2>Available Jobs</h2>
      <form onSubmit={handleSearch} style={{marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap:'wrap'}}>
        <input
          type="text"
          placeholder="Keyword"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <input
          type="text"
          placeholder="Job Type"
          value={jobType}
          onChange={e => setJobType(e.target.value)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={() => { setKeyword(''); setLocation(''); setJobType(''); fetchJobs(); }}>Reset</button>
      </form>

      {loading && <div>Loading jobs...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && jobs.length === 0 && <div>No jobs found.</div>}
      <ul className="job-list">
        {jobs.map(job => (
          <li key={job.id} className="job-item">
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.employerName}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Type:</strong> {job.jobType}</p>
            <p><strong>Salary:</strong> {job.salary || 'N/A'}</p>
            <p><strong>Deadline:</strong> {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'N/A'}</p>
            <button onClick={() => setSelectedJob(job)}>View Details</button>
          </li>
        ))}
      </ul>
      {/* Modal */}
      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

export default BrowseJobs;