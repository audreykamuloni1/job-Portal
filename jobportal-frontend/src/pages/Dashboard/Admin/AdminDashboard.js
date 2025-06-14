import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import GroupIcon from '@mui/icons-material/Group';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link as RouterLink } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
        Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* User Management Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow:3 }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <GroupIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="div" gutterBottom>
                User Management
              </Typography>
              <Typography color="text.secondary">
                View, activate, or deactivate user accounts. Manage roles and permissions.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', p: 2 }}>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/admin/user-management"
              >
                Manage Users
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Job Approval Management Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow:3 }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <WorkHistoryIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="div" gutterBottom>
                Job Approvals
              </Typography>
              <Typography color="text.secondary">
                Review and approve or reject job postings submitted by employers.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', p: 2 }}>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/admin/job-approvals"
              >
                Manage Job Postings
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Site Settings (Placeholder) */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow:3 }}>
            <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
              <SettingsIcon color="action" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" component="div" gutterBottom>
                Site Settings
              </Typography>
              <Typography color="text.secondary">
                Configure application settings, manage categories, or view site analytics (future).
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', p: 2 }}>
              <Button 
                variant="outlined" 
                // component={RouterLink} 
                // to="/admin/settings" // Future link
                disabled // Disabled for now
              >
                Configure Settings
              </Button>
            </CardActions>
          </Card>
        </Grid>

      </Grid>
      {/* Future sections for stats, reports, etc. can be added here */}
      {/* <Paper sx={{p:3, mt:4}}>
        <Typography variant="h6">Quick Stats</Typography>
        <Typography>Total Users: X | Total Jobs Posted: Y | Pending Approvals: Z</Typography>
      </Paper> */}
    </Container>
  );
};

export default AdminDashboard;
