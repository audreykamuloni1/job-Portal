import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useCallback } from 'react'; // Import useEffect and useCallback
import CircularProgress from '@mui/material/CircularProgress';
import adminService from '../../../services/adminService';
import { useLoading } from '../../../contexts/LoadingContext';
import { showSuccessToast, showErrorToast } from '../../../utils/notifications';


// Removed sampleJobsForApproval

const JobApprovalPage = () => {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { showLoading, hideLoading, isLoading } = useLoading();

  const fetchPendingJobs = useCallback(async () => {
    showLoading('Loading pending jobs...');
    try {
      const data = await adminService.getPendingJobs();
      // Assuming backend returns only 'PENDING_APPROVAL' or similar status that needs action
      // Or filter here if it returns mixed statuses for some reason
      setJobs(data || []);
    } catch (error) {
      showErrorToast(error.message || 'Failed to fetch pending jobs.');
      setJobs([]);
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  useEffect(() => {
    fetchPendingJobs();
  }, [fetchPendingJobs]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApproveJob = async (jobId) => {
    showLoading('Approving job...');
    try {
      await adminService.approveJob(jobId);
      showSuccessToast('Job approved successfully!');
      // Remove the job from the list or refetch
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (error) {
      showErrorToast(error.message || 'Failed to approve job.');
    } finally {
      hideLoading();
    }
  };

  const handleRejectJob = async (jobId) => {
    showLoading('Rejecting job...');
     try {
      await adminService.rejectJob(jobId);
      showSuccessToast('Job rejected successfully!');
      // Remove the job from the list or refetch
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (error) {
      showErrorToast(error.message || 'Failed to reject job.');
    } finally {
      hideLoading();
    }
  };
  
  const displayedJobs = jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (isLoading && jobs.length === 0) {
    return (
        <Container sx={{py:4, textAlign:'center'}}>
            <CircularProgress />
            <Typography>Loading jobs for approval...</Typography>
        </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
        Job Approval Management
      </Typography>

      {displayedJobs.length === 0 && !isLoading && (
        <Paper sx={{p:3, textAlign:'center'}}>
            <Typography variant="subtitle1">No jobs are currently pending approval.</Typography>
        </Paper>
      )}

      {displayedJobs.length > 0 && (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="job approval table">
          <TableHead sx={{ backgroundColor: 'grey.100' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Posted Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedJobs.map((job) => (
              <TableRow
                key={job.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': {backgroundColor: 'action.hover'} }}
              >
                <TableCell component="th" scope="row">{job.title}</TableCell>
                <TableCell>{job.companyName}</TableCell>
                <TableCell align="center">{job.postedDate}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={job.status} 
                    color={
                      job.status === 'Pending Approval' ? 'warning' :
                      job.status === 'Approved' ? 'success' :
                      job.status === 'Rejected' ? 'error' : 'default'
                    } 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="primary" 
                    component={RouterLink} 
                    to={`/jobs/${job.id}`} // Link to view job details
                    title="View Job Details"
                  >
                    <VisibilityIcon fontSize="small"/>
                  </IconButton>
                  {job.status === 'Pending Approval' && (
                    <>
                      <IconButton 
                        color="success" 
                        onClick={() => handleApproveJob(job.id)}
                        title="Approve Job"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleRejectJob(job.id)}
                        title="Reject Job"
                      >
                        <CancelIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {displayedJobs.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} align="center">
                        No jobs currently pending approval or matching criteria.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={jobs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
};

export default JobApprovalPage;
