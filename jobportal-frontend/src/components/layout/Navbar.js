import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears context and localStorage
    navigate('/login'); // Redirect to login page
  };

  const isJobSeeker = user?.roles?.includes('ROLE_JOB_SEEKER');
  const isEmployer = user?.roles?.includes('ROLE_EMPLOYER');
  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

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
        
        {/* Desktop Links */}
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/jobs">Jobs</Button>

          {isAuthenticated ? (
            <>
              {isJobSeeker && (
                <>
                  <Button color="inherit" component={RouterLink} to="/dashboard/job-seeker">Dashboard</Button>
                  <Button color="inherit" component={RouterLink} to="/profile/job-seeker">My Profile</Button>
                  <Button color="inherit" component={RouterLink} to="/my-applications">My Applications</Button>
                </>
              )}
              {isEmployer && (
                <>
                  <Button color="inherit" component={RouterLink} to="/dashboard/employer">EMP Dashboard</Button>
                  <Button color="inherit" component={RouterLink} to="/profile/employer">Company Profile</Button>
                  <Button color="inherit" component={RouterLink} to="/employer/post-job">Post Job</Button>
                  {/* <Button color="inherit" component={RouterLink} to="/employer/manage-jobs">Manage Jobs</Button> */}
                </>
              )}
              {isAdmin && (
                <Button color="inherit" component={RouterLink} to="/admin/dashboard">Admin Panel</Button>
              )}
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/register">Register</Button>
            </>
          )}
        </Box>
        
        {/* Placeholder for Mobile Menu - IconButton and Menu/Drawer would go here */}
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
