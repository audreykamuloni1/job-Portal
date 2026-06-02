import React, { useState, useEffect, useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useLoading } from '../../contexts/LoadingContext';
import { showErrorToast } from '../../utils/notifications';
import jobService from '../../services/jobService';
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
import { useSearchParams } from 'react-router-dom';

const JobListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [keywords, setKeywords] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const { showLoading, hideLoading, isLoading } = useLoading();
  
  // Pagination state
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(0); 

  const fetchJobs = useCallback(async (paramsObj = {}) => {
    showLoading('Fetching jobs...');
    try {
      const data = await jobService.searchJobs({ 
          keyword: paramsObj.keyword !== undefined ? paramsObj.keyword : keywords, 
          location: paramsObj.location !== undefined ? paramsObj.location : location, 
          jobType: paramsObj.jobType !== undefined ? paramsObj.jobType : jobType,
        });

      setJobs(data || []); 
      if (data && data.length > 0) {
          const itemsPerPageLocal = 9; 
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
  }, [showLoading, hideLoading, keywords, location, jobType]); 

  // Synchronize state with URL search params on mount or param updates
  useEffect(() => {
    const kw = searchParams.get('keyword') || '';
    const loc = searchParams.get('location') || '';
    const type = searchParams.get('jobType') || '';
    setKeywords(kw);
    setLocation(loc);
    setJobType(type);
    setPage(1);
    fetchJobs({ keyword: kw, location: loc, jobType: type });
  }, [searchParams]); 

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchParams({
      keyword: keywords,
      location: location,
      jobType: jobType
    });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
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
        <Typography align="center" sx={{ mt: 4 }}>Loading jobs...</Typography>
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