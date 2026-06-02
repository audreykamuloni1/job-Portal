import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import { useLoading } from '../../contexts/LoadingContext';
import { showSuccessToast, showErrorToast } from '../../utils/notifications';
import jobService from '../../services/jobService';
import Paper from '@mui/material/Paper';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import ApplyJobModal from '../../components/applications/ApplyJobModal'; // Import ApplyJobModal
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress'; // For loading state

// Removed static sampleJobDetail

const JobDetailsPage = () => {
  const { jobId } = useParams(); 
  const [job, setJob] = useState(null);
  const { showLoading, hideLoading, isLoading } = useLoading();
  const { isAuthenticated, user } = useAuth(); // Get auth state and user
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      showLoading(`Loading details for job ${jobId}...`);
      try {
        const data = await jobService.getJobById(jobId);
        setJob(data);
      } catch (error) {
        showErrorToast(error.message || `Failed to fetch details for job ${jobId}.`);
        setJob(null); // Set to null if job not found or error
      } finally {
        hideLoading();
      }
    };

    fetchJobDetails();
  }, [jobId, showLoading, hideLoading]); // Dependencies for useEffect

  if (isLoading && !job) { // Show loading indicator if actively loading AND job data isn't there yet
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading job details...</Typography>
      </Container>
    );
  }

  if (!job) { // This will show if loading finished and job is still null (e.g. not found)
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" component="h1" align="center" color="error">
          Job Not Found
        </Typography>
        <Typography align="center">
          The job you are looking for does not exist or may have been removed.
        </Typography>
        <Box sx={{textAlign: 'center', mt:2}}>
            <Button component={RouterLink} to="/jobs" variant="outlined">
                Back to Job Listings
            </Button>
        </Box>
      </Container>
    );
  }
  
  // Default empty arrays for responsibilities, qualifications, benefits if not present
  const responsibilities = job.responsibilities || [];
  const qualifications = job.qualifications || [];
  const benefits = job.benefits || [];

  const handleModalClose = (applicationSubmitted) => {
    setIsApplyModalOpen(false);
    if (applicationSubmitted === true) { // Check for explicit true from modal
      showSuccessToast("Application submitted successfully! You can view its status in 'My Applications'.");
      // Potentially disable apply button or change its text if user has applied
    }
  };

  const canApply = isAuthenticated && user?.roles?.includes('ROLE_JOB_SEEKER');


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {job.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1, flexWrap: 'wrap' }}>
            <BusinessIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="h6" component="span" sx={{ mr: 3 }}>{job.companyName}</Typography>
            <LocationOnIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="h6" component="span" sx={{ mr: 3 }}>{job.location}</Typography>
            <WorkOutlineIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="h6" component="span">{job.jobType}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.disabled', mt:1 }}>
            <CalendarTodayIcon sx={{ mr: 1, fontSize: '1rem' }} />
            <Typography variant="body2">Posted: {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}</Typography>
            {job.salaryRange && (
                 <Typography variant="body2" sx={{ ml: 3, fontWeight: 'bold' }}>Salary: {job.salaryRange}</Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Job Overview */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>Job Overview</Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
            {job.overview}
          </Typography>
        </Box>

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>Key Responsibilities</Typography>
            <List dense>
              {job.responsibilities.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemIcon sx={{minWidth: '30px'}}><CheckCircleOutlineIcon color="primary" fontSize="small" /></ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Qualifications */}
        {job.qualifications && job.qualifications.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>Qualifications</Typography>
            <List dense>
              {job.qualifications.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemIcon sx={{minWidth: '30px'}}><CheckCircleOutlineIcon color="primary" fontSize="small" /></ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
        
        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>What We Offer</Typography>
            <List dense>
              {job.benefits.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemIcon sx={{minWidth: '30px'}}><CheckCircleOutlineIcon color="primary" fontSize="small" /></ListItemIcon>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Apply Button */}
        {canApply && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                onClick={() => setIsApplyModalOpen(true)}
                sx={{px: 5, py:1.5, fontSize: '1.1rem'}}
            >
                Apply for this Job
            </Button>
            </Box>
        )}
        {!isAuthenticated && (
             <Box sx={{ textAlign: 'center', mt: 4, p:2, backgroundColor: 'warning.light', borderRadius:1 }}>
                <Typography variant="body1">
                    Please <Link component={RouterLink} to="/login" sx={{fontWeight:'bold'}}>login</Link> as a Job Seeker to apply for this job.
                </Typography>
            </Box>
        )}
         {isAuthenticated && !canApply && (
             <Box sx={{ textAlign: 'center', mt: 4, p:2, backgroundColor: 'info.light', borderRadius:1 }}>
                <Typography variant="body1">
                    Only Job Seekers can apply. Your current role does not permit job applications.
                </Typography>
            </Box>
        )}
      </Paper>
{job && (
  // Ensure job data is loaded before rendering modal
  <ApplyJobModal
    open={isApplyModalOpen}
    onClose={handleModalClose}
    jobId={job.id}
    jobTitle={job.title}
  />
)}
    </Container>
  );
};

export default JobDetailsPage;
