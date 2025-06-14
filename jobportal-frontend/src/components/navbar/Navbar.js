import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" component="nav" sx={{ backgroundColor: 'primary.main' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
        >
          JobPortal Malawi
        </Typography>
        
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/jobs">Jobs</Button>
          
          {/* Placeholder Job Seeker Links - will be conditionally rendered later */}
          <Button color="inherit" component={RouterLink} to="/dashboard/job-seeker">JS Dashboard</Button> {/* Renamed for clarity */}
          <Button color="inherit" component={RouterLink} to="/profile/job-seeker">JS Profile</Button> {/* Renamed for clarity */}
          <Button color="inherit" component={RouterLink} to="/my-applications">JS Applications</Button> {/* Renamed for clarity */}
          {/* End Placeholder Job Seeker Links */}

          {/* Placeholder Employer Links - will be conditionally rendered later */}
          <Button color="inherit" component={RouterLink} to="/dashboard/employer">EMP Dashboard</Button>
          <Button color="inherit" component={RouterLink} to="/profile/employer">EMP Profile</Button>
          {/* End Placeholder Employer Links */}

          {/* Placeholder Admin Link - will be conditionally rendered later */}
          <Button color="inherit" component={RouterLink} to="/admin/dashboard">Admin Panel</Button>
          {/* End Placeholder Admin Link */}
          
          <Button color="inherit" component={RouterLink} to="/login">Login</Button>
          <Button color="inherit" component={RouterLink} to="/register">Register</Button>
        </Box>
        {/* Placeholder for potential mobile menu toggle */}
        {/* <Box sx={{ display: { sm: 'none' } }}>
          <IconButton color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
        </Box> */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
