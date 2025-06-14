import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import Box from '@mui/material/Box'; // Not strictly needed for this layout
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../../contexts/LoadingContext';
import { showSuccessToast, showErrorToast } from '../../../utils/notifications';
import jobService from '../../../services/jobService'; // Adjusted path

const PostJobPage = () => {
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [jobDetails, setJobDetails] = useState({
    title: '',
    location: '',
    jobType: 'Full-time', // Default job type
    salaryRange: '', // Optional
    description: '',
    requirements: '',
    // employerId is not explicitly set here, assumed to be handled by backend via JWT
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setJobDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!jobDetails.title || !jobDetails.location || !jobDetails.description || !jobDetails.requirements || !jobDetails.jobType) {
      showErrorToast('Please fill in all required fields including Job Type.');
      return;
    }
    showLoading('Posting job...');
    try {
      await jobService.postJob(jobDetails);
      showSuccessToast('Job posted successfully!');
      navigate('/employer/manage-jobs'); // Redirect to manage jobs page
       // Optionally reset form:
      setJobDetails({ 
        title: '', location: '', jobType: 'Full-time', salaryRange: '', 
        description: '', requirements: '' 
      });
    } catch (error) {
      showErrorToast(error.message || 'Failed to post job. Please try again.');
    } finally {
      hideLoading();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
        Post a New Job
      </Typography>
      
      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{ p: {xs: 2, md: 4}, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth label="Job Title" name="title" value={jobDetails.title} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Location" name="location" value={jobDetails.location} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="job-type-label">Job Type</InputLabel>
              <Select labelId="job-type-label" name="jobType" value={jobDetails.jobType} onChange={handleChange} label="Job Type">
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
                <MenuItem value="Contract">Contract</MenuItem>
                <MenuItem value="Internship">Internship</MenuItem>
                <MenuItem value="Temporary">Temporary</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Salary Range (Optional)" name="salaryRange" value={jobDetails.salaryRange} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Job Description" name="description" multiline rows={6} value={jobDetails.description} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Requirements & Qualifications" name="requirements" multiline rows={4} value={jobDetails.requirements} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2, textAlign: 'right' }}>
            <Button type="submit" variant="contained" color="primary" size="large">Post Job</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PostJobPage;
