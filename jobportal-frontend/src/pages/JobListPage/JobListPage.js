import React, { useState, useEffect, useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useLoading } from '../../contexts/LoadingContext'; // Import useLoading
import { showErrorToast } from '../../utils/notifications'; // Import showErrorToast
import jobService from '../../services/jobService'; // Import jobService
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper'; 
import JobCard from '../../components/jobs/JobCard'; 

// Removed sampleJobs, will fetch from API

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const { showLoading, hideLoading, isLoading } = useLoading();
  
  // Pagination state
  const [page, setPage] = useState(1); // Current page (1-indexed for MUI Pagination)
  const [totalPages, setTotalPages] = useState(0); // Total pages from API or calculated
  // const [itemsPerPage, setItemsPerPage] = useState(9); // Or get from API response

  const fetchJobs = useCallback(async (searchParams = {}) => {
    showLoading('Fetching jobs...');
    try {
      // The existing jobService.searchJobs can be used for both initial load (empty params) and search
      // Or, use jobService.getAllJobs() for initial load if preferred and it supports pagination
      // For now, using searchJobs for all fetching.
      // Assume backend handles pagination if `page` and `limit` params are sent.
      // This part needs alignment with how your backend pagination works.
      // If jobService.searchJobs doesn't support pagination, this will just fetch all matching.
      const data = await jobService.searchJobs({ 
          keyword: searchParams.keyword || '', 
          location: searchParams.location || '', 
          jobType: searchParams.jobType || '',
          // page: searchParams.page || 1, // Example: if backend supports page
          // limit: itemsPerPage,         // Example: if backend supports limit
        });

      setJobs(data || []); // Assuming data is an array of jobs
      // If backend sends pagination info:
      // setTotalPages(data.totalPages || 0); 
      // setPage(data.currentPage || 1);
      // For now, with no backend pagination, calculate totalPages based on fetched jobs
      // This is not ideal if fetching all jobs; pagination should be backend-driven.
      if (data && data.length > 0) {
          // Simulate pagination for frontend if backend doesn't provide it
          // This is a temporary measure. Real pagination needs backend support.
          const itemsPerPageLocal = 9; // Display 9 jobs per page
          setTotalPages(Math.ceil(data.length / itemsPerPageLocal));
      } else {
          setTotalPages(0);
      }

    } catch (error) {
      showErrorToast(error.message || 'Failed to fetch jobs.');
      setJobs([]);
      setTotalPages(0);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]); // Add itemsPerPage if it's a state

  useEffect(() => {
    fetchJobs({ page }); // Initial fetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // Refetch when page changes, if backend supports pagination

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchJobs({ keyword: keywords, location: location, jobType: jobType, page: 1 });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // If pagination is purely frontend after one large fetch:
    // No need to call fetchJobs here, just update page state for slicing.
    // If pagination is backend-driven:
    // fetchJobs({ keyword: keywords, location: location, jobType: jobType, page: value });
  };
  
  // For purely frontend pagination after one fetch (if backend doesn't paginate)
  const itemsPerPageFrontend = 9;
  const currentDisplayedJobs = jobs.slice((page - 1) * itemsPerPageFrontend, page * itemsPerPageFrontend);


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb:4 }}>
        Available Jobs
      </Typography>

      {/* Search and Filter Area */}
      <Paper component="form" onSubmit={handleSearch} elevation={2} sx={{ p: 3, mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, borderRadius: 2 }}>
        <TextField label="Keywords (e.g., Engineer, Sales)" variant="outlined" value={keywords} onChange={(e) => setKeywords(e.target.value)} sx={{ flexGrow: 1 }} />
        <TextField label="Location (e.g., Lilongwe, Remote)" variant="outlined" value={location} onChange={(e) => setLocation(e.target.value)} sx={{ flexGrow: 1 }} />
        <FormControl variant="outlined" sx={{ minWidth: 180, flexGrow: 1 }}>
          <InputLabel id="job-type-label">Job Type</InputLabel>
          <Select labelId="job-type-label" id="job-type-select" value={jobType} onChange={(e) => setJobType(e.target.value)} label="Job Type">
            <MenuItem value=""><em>All Types</em></MenuItem>
            <MenuItem value="Full-time">Full-time</MenuItem>
            <MenuItem value="Part-time">Part-time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
            <MenuItem value="Internship">Internship</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" size="large" sx={{ py: '15px', px:4 }}>Search</Button>
      </Paper>

      {/* Job Listings */}
      {isLoading ? (
        <Typography>Loading jobs...</Typography>
      ) : currentDisplayedJobs.length > 0 ? (
        <Grid container spacing={3}>
          {currentDisplayedJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="subtitle1" align="center" sx={{ mt: 4 }}>
          No jobs found matching your criteria. Try adjusting your search.
        </Typography>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination 
            count={totalPages} 
            page={page}
            onChange={handlePageChange}
            color="primary" 
            showFirstButton 
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
};

export default JobListPage;