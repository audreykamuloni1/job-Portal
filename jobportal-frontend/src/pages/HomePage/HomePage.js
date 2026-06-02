import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { showSuccessToast, showErrorToast } from '../../utils/notifications';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import jobService from '../../services/jobService';
import JobCard from '../../components/jobs/JobCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    showSuccessToast("Welcome to JobPortal Malawi!");
    
    // Fetch Featured Jobs dynamically on mount
    const fetchFeatured = async () => {
      try {
        const data = await jobService.getAllJobs();
        // Filter active/approved jobs and display up to 3 on the home page
        const activeJobs = (data || []).filter(job => job.active || job.status === 'APPROVED');
        setFeaturedJobs(activeJobs.slice(0, 3));
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
        showErrorToast("Could not load featured jobs.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/jobs?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box 
        sx={{ 
          textAlign: 'center', 
          my: 8, 
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Find Your Dream Job in Malawi
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Discover thousands of job opportunities from top companies and kickstart your career today.
        </Typography>
        
        {/* Active, State-Bound Search Bar */}
        <Box 
          component="form" 
          onSubmit={handleSearchSubmit}
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            mb: 4,
            width: '100%',
            maxWidth: '600px', 
            margin: '0 auto 32px auto' 
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Search by job title, keyword, or company..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            fullWidth
            sx={{ mr: 1, '& .MuiOutlinedInput-root': { borderRadius: '25px 0 0 25px' } }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
              ),
            }}
          />
          <Button 
            type="submit"
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ py: '15px', borderRadius: '0 25px 25px 0', boxShadow: 'none', px: 4 }}
          >
            Search
          </Button>
        </Box>

        <Button 
          variant="outlined" 
          color="primary" 
          size="large"
          component={RouterLink}
          to="/jobs"
          sx={{ mr: 2, borderColor: 'primary.main', '&:hover': { borderColor: 'primary.dark' } }}
        >
          Browse All Jobs
        </Button>
      </Box>

      {/* Dynamic Featured Jobs Section */}
      <Box sx={{ my: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 4 }}>
          Featured Jobs
        </Typography>
        
        {loading ? (
          <Typography align="center" color="text.secondary">
            Loading featured jobs...
          </Typography>
        ) : featuredJobs.length > 0 ? (
          <Grid container spacing={3}>
            {featuredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <JobCard job={job} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography align="center" color="text.secondary">
            No featured jobs available at the moment.
          </Typography>
        )}
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ my: 8, py: 6, backgroundColor: 'background.paper', borderRadius: 3, p: 4, boxShadow: 1 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
          Why Choose Us?
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" paragraph sx={{ maxWidth: '800px', margin: '0 auto' }}>
          We provide Malawi's most comprehensive and modern placement platform, seamlessly connecting high-talent individuals with leading corporate employers. Our user-friendly interfaces, automated email alerts, and secure credential handling ensure your professional growth is our first priority.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;