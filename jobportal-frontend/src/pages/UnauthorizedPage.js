import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; // Example Icon
import { Link as RouterLink, useLocation } from 'react-router-dom';

const UnauthorizedPage = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  return (
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: 'calc(100vh - 120px)' }}> {/* Adjust minHeight based on Navbar/Footer */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center',
          width: '100%'
        }}
      >
        <ReportProblemIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You do not have the necessary permissions to access this page.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          If you believe this is an error, please contact support or ensure you are logged in with the correct account.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            component={RouterLink} 
            to={from} // Attempt to go back to the previous page
          >
            Go Back
          </Button>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/"
          >
            Go to Homepage
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage;
