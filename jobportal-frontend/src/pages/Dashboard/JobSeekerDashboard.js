import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';
import Divider from '@mui/material/Divider';

// Placeholder data - replace with actual data later
const userName = "Jane Doe"; // This would come from auth context or user data

const recentApplications = [
  { id: 1, jobTitle: 'Frontend Developer', company: 'Tech Solutions Inc.', status: 'Pending' },
  { id: 2, jobTitle: 'UX Designer', company: 'Creative Minds LLC', status: 'Viewed' },
  { id: 3, jobTitle: 'React Native Developer', company: 'Mobile First Ltd.', status: 'Interview Scheduled' },
];

const JobSeekerDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Welcome to your Dashboard, {userName}!
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Summary Teaser */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              Profile Summary
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
              Keep your profile up-to-date to attract the best opportunities. Complete your skills, experience, and resume.
            </Typography>
            <Button 
              variant="contained" 
              component={RouterLink} 
              to="/profile/job-seeker" // Path to be confirmed/updated in App.js
              sx={{ mt: 2 }}
            >
              View/Edit Profile
            </Button>
          </Paper>
        </Grid>

        {/* Recent Applications Teaser */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              Recent Applications
            </Typography>
            {recentApplications.length > 0 ? (
              <List dense>
                {recentApplications.map((app) => (
                  <React.Fragment key={app.id}>
                    <ListItem
                      secondaryAction={
                        <Typography variant="caption" color="text.secondary">{app.status}</Typography>
                      }
                    >
                      <ListItemText 
                        primary={app.jobTitle} 
                        secondary={app.company} 
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                You haven't applied for any jobs recently.
              </Typography>
            )}
            <Button 
              variant="outlined" 
              component={RouterLink} 
              to="/my-applications" // Path to be confirmed/updated in App.js
              sx={{ mt: 2 }}
            >
              View All Applications
            </Button>
          </Paper>
        </Grid>

        {/* Saved Jobs Teaser (Placeholder) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              Saved Jobs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You have no saved jobs yet. Start browsing and save jobs you're interested in!
            </Typography>
            <Button 
              variant="outlined" 
              component={RouterLink} 
              to="/jobs" // Path to job listings
              sx={{ mt: 2 }}
            >
              Browse Jobs
            </Button>
          </Paper>
        </Grid>
        
        {/* Quick Actions (Placeholder) */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1}}>
              <Button variant="text" component={RouterLink} to="/jobs">Search New Jobs</Button>
              <Button variant="text" component={RouterLink} to="/profile/job-seeker#resume">Update Resume</Button>
              <Button variant="text" component={RouterLink} to="/settings">Account Settings</Button> 
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default JobSeekerDashboard;