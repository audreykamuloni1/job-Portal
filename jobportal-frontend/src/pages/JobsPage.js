import { useState, useEffect } from 'react';
import api from '../services/api';
import JobList from '../components/jobs/JobListPage';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
      } catch (err) {
        setError('Failed to fetch jobs. Please try again later.');
      }
      setLoading(false);
    };
    
    fetchJobs();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Available Jobs</h2>
      {/* Search input and job list */}
      <JobList 
        jobs={jobs} 
        loading={loading} 
        error={error} 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
    </div>
  );
};

export default JobsPage;