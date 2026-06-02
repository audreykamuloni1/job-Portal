import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
// import Box from '@mui/material/Box'; // Not strictly needed for this version
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
// import GroupIcon from '@mui/icons-material/Group'; // Removed for brevity
import { Link as RouterLink } from 'react-router-dom';

const companyName = "Your Company"; // Placeholder

const EmployerDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Welcome, {companyName}! (Employer Dashboard)
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              <AddCircleOutlineIcon sx={{verticalAlign: 'middle', mr:1}}/> Quick Actions
            </Typography>
            <Button 
              variant="contained" 
              component={RouterLink} 
              to="/employer/post-job" // Placeholder path, ensure this route is defined in App.js
              fullWidth
              sx={{ mt: 2, mb:1 }}
            >
              Post New Job
            </Button>
            <Button 
              variant="outlined" 
              component={RouterLink} 
              to="/profile/employer" 
              fullWidth
              sx={{ mt: 1 }}
            >
              Update Company Profile
            </Button>
          </Paper>
        </Grid>

        {/* Posted Jobs Summary */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              <AssessmentIcon sx={{verticalAlign: 'middle', mr:1}}/> Posted Jobs
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb:1}}>
                You have 0 active job postings. {/* Placeholder */}
            </Typography>
            {/* Example Job Item (static) */}
            <List dense>
                <ListItem>
                    <ListItemText primary="Sample Job: Senior Developer" secondary="Status: Open - 5 Applicants" />
                </ListItem>
                <Divider component="li" />
            </List>
            <Button 
              variant="text" 
              component={RouterLink} 
              to="/employer/manage-jobs" // Placeholder path
              sx={{ mt: 2 }}
            >
              Manage All Jobs
            </Button>
          </Paper>
        </Grid>

        {/* Company Profile Summary Teaser */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              <BusinessIcon sx={{verticalAlign: 'middle', mr:1}}/> Company Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Keep your company profile complete and up-to-date to attract top talent.
            </Typography>
            <Button 
              variant="outlined" 
              component={RouterLink} 
              to="/profile/employer" 
            >
              View/Edit Company Profile
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmployerDashboard;
