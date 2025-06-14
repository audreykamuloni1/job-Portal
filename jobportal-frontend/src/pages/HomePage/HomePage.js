import React, { useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { showSuccessToast } from '../../utils/notifications'; // Adjust path as needed
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { Link as RouterLink } from 'react-router-dom';

const HomePage = () => {
  useEffect(() => {
    showSuccessToast("Welcome to JobPortal Malawi!");
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          textAlign: 'center', 
          my: 8, // margin top and bottom
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Find Your Dream Job in Malawi
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Discover thousands of job opportunities from top companies and kickstart your career today.
        </Typography>
        
        {/* Search Bar - Non-functional for now */}
        <Box 
          component="form" 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            mb: 4,
            width: '100%',
            maxWidth: '600px', // Limit search bar width
            margin: '0 auto 32px auto' // Center the search bar
          }}
          onSubmit={(e) => e.preventDefault()} // Prevent actual form submission
        >
          <TextField
            variant="outlined"
            placeholder="Search by job title, keyword, or company..."
            fullWidth
            sx={{ mr: 1, '& .MuiOutlinedInput-root': { borderRadius: '25px 0 0 25px' } }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
              ),
            }}
          />
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ py: '15px', borderRadius: '0 25px 25px 0', boxShadow: 'none' }}
            onClick={() => { /* Placeholder for search action */ }}
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
        {/* Add more CTAs or info sections if needed */}
      </Box>

      {/* Placeholder for Featured Jobs Section */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 500 }}>
          Featured Jobs
        </Typography>
        <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
          {/* This area will later display JobCard components or similar */}
          <p>Loading featured jobs...</p> 
          {/* Example: <Grid container spacing={3}> <Grid item xs={12} sm={6} md={4}><JobCard job={...} /></Grid> ... </Grid> */}
        </Box>
      </Box>

      {/* Placeholder for Why Us Section */}
      <Box sx={{ my: 6, py:4, backgroundColor: 'background.paper', borderRadius: 2, p:3 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ fontWeight: 500 }}>
          Why Choose Us?
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center" paragraph>
          We provide a comprehensive platform connecting talented individuals with leading employers in Malawi. 
          Our user-friendly interface and extensive job listings make your job search efficient and effective.
        </Typography>
        {/* Could add more detailed points using Grid and Icons */}
      </Box>
    </Container>
  );
};

export default HomePage;