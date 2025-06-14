import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
// JobCard is not used in the Table display mode, but kept for potential future use/toggle
// import JobCard from '../../../components/jobs/JobCard'; 
import jobService from '../../../services/jobService';
import { useLoading } from '../../../contexts/LoadingContext';
import { showSuccessToast, showErrorToast } from '../../../utils/notifications'; // showErrorToast for fetch errors
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility'; // For View Applicants
import Tooltip from '@mui/material/Tooltip';

const ManageJobsPage = () => {
  const [employerJobs, setEmployerJobs] = useState([]);
  const { showLoading, hideLoading, isLoading } = useLoading();

  const fetchJobs = async () => {
    showLoading('Loading your job postings...');
    try {
      const data = await jobService.getEmployerJobs();
      setEmployerJobs(data || []); 
    } catch (error) {
      showErrorToast(error.message || 'Failed to fetch your jobs.');
      setEmployerJobs([]); 
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
        return;
    }
    showLoading('Deleting job...');
    try {
        // await jobService.deleteJob(jobId); // Uncomment when service function is ready
        // For now, simulate deletion:
        setEmployerJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        showSuccessToast('Job deleted successfully (simulated).'); 
        // fetchJobs(); // Or refresh list after delete if not simulating
    } catch (error) {
        showErrorToast(error.message || 'Failed to delete job.');
    } finally {
        hideLoading();
    }
    console.log(`Attempt to delete job ID: ${jobId}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}> {/* Changed to xl for wider table */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Manage Your Job Postings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/employer/post-job" // Path defined in App.js
          startIcon={<AddIcon />}
        >
          Post New Job
        </Button>
      </Box>

      {isLoading && !employerJobs.length ? (
        <Typography>Loading jobs...</Typography>
      ) : employerJobs.length === 0 ? (
        <Paper sx={{p:3, textAlign:'center'}}>
            <Typography variant="subtitle1">You have not posted any jobs yet.</Typography>
            <Button component={RouterLink} to="/employer/post-job" variant="outlined" sx={{mt:2}}>
                Post Your First Job
            </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2} sx={{borderRadius:2}}>
          <Table sx={{ minWidth: 750 }} aria-label="manage jobs table"> {/* Increased minWidth */}
            <TableHead sx={{backgroundColor: 'grey.100'}}>
              <TableRow>
                <TableCell sx={{fontWeight:'bold', width: '30%'}}>Title</TableCell>
                <TableCell sx={{fontWeight:'bold', width: '20%'}}>Location</TableCell>
                <TableCell sx={{fontWeight:'bold', width: '15%'}} align="center">Type</TableCell>
                <TableCell sx={{fontWeight:'bold', width: '15%'}} align="center">Status</TableCell>
                {/* <TableCell sx={{fontWeight:'bold'}} align="center">Applicants</TableCell> */}
                <TableCell sx={{fontWeight:'bold', width: '20%'}} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employerJobs.map((job) => (
                <TableRow key={job.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Typography variant="subtitle2" component={RouterLink} to={`/jobs/${job.id}`} sx={{textDecoration:'none', color:'primary.main', '&:hover':{textDecoration:'underline'}}}>
                        {job.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell align="center">{job.jobType || 'N/A'}</TableCell>
                  <TableCell align="center">{job.status || 'N/A'}</TableCell> {/* Assuming job has a status */}
                  {/* <TableCell align="center">{job.applicantCount || 0}</TableCell> */}
                  <TableCell align="center">
                    <Tooltip title="View Applicants">
                        <IconButton 
                            component={RouterLink} 
                            to={`/employer/jobs/${job.id}/applicants`} 
                            color="primary"
                            size="small"
                        >
                        <VisibilityIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Job (future)">
                        <IconButton 
                            // component={RouterLink} 
                            // to={`/employer/edit-job/${job.id}`}  // Placeholder for edit job route
                            color="secondary"
                            size="small"
                            disabled // Not implemented yet
                        >
                        <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Job">
                        <IconButton 
                            onClick={() => handleDeleteJob(job.id)} 
                            color="error"
                            size="small"
                        >
                        <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ManageJobsPage;
