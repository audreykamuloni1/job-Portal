import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useLoading } from '../../../contexts/LoadingContext';
import { showErrorToast } from '../../../utils/notifications';
import applicationService from '../../../services/applicationService';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { Link as RouterLink } from 'react-router-dom';
import TablePagination from '@mui/material/TablePagination'; 

// Sample static application data - REMOVED, will fetch from API

const getStatusChipColor = (status) => {
  if (!status) return 'default'; // Handle undefined or null status
  switch (status.toLowerCase()) {
    case 'pending':
      return 'default';
    case 'viewed':
      return 'info';
    case 'interview scheduled':
      return 'primary';
    case 'offer extended':
      return 'success';
    case 'rejected':
      return 'error';
    case 'withdrawn':
      return 'warning';
    default:
      return 'default';
  }
};


const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const { showLoading, hideLoading, isLoading } = useLoading();
  
  const [page, setPage] = useState(0); // For TablePagination (0-indexed)
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchApplications = async () => {
      showLoading('Loading your applications...');
      try {
        const response = await applicationService.getApplicationsByUser();
        // Existing service returns full response, so access data property
        setApplications(response.data || []); 
      } catch (error) {
        showErrorToast(error.response?.data?.message || error.message || 'Failed to fetch applications.');
        setApplications([]); // Set to empty array on error
      } finally {
        hideLoading();
      }
    };
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run once on mount

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedApplications = applications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb:3 }}>
        My Applications
      </Typography>

      {isLoading && applications.length === 0 ? (
        <Typography>Loading applications...</Typography>
      ) : !isLoading && applications.length === 0 ? (
        <Paper sx={{p:3, textAlign: 'center'}}>
            <Typography variant="subtitle1">You have not submitted any applications yet.</Typography>
            <Button component={RouterLink} to="/jobs" variant="contained" sx={{mt:2}}>
                Browse Jobs
            </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2}}>
          <Table sx={{ minWidth: 650 }} aria-label="my applications table">
            <TableHead sx={{ backgroundColor: 'grey.100' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Job Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Date Applied</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedApplications.map((app) => (
                <TableRow
                  key={app.id} // Assuming 'id' is application ID
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': {backgroundColor: 'action.hover'} }}
                >
                  <TableCell component="th" scope="row">
                     {/* Ensure app.job is populated by backend or adjust access */}
                    <Typography variant="subtitle2" color="primary.main" component={RouterLink} to={`/jobs/${app.job?.id || app.jobId}`} sx={{textDecoration:'none', '&:hover':{textDecoration:'underline'}}}>
                        {app.job?.title || app.jobTitle || 'N/A'} 
                    </Typography>
                  </TableCell>
                   {/* Ensure app.job is populated by backend or adjust access */}
                  <TableCell>{app.job?.companyName || app.companyName || 'N/A'}</TableCell>
                  <TableCell align="center">{app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell align="center">
                    <Chip label={app.status || 'N/A'} color={getStatusChipColor(app.status)} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Button 
                      variant="outlined" 
                      size="small"
                      component={RouterLink} 
                      to={`/jobs/${app.job?.id || app.jobId}`} 
                    >
                      View Job
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={applications.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> 
          */}
        </TableContainer>
      )}
    </Container>
  );
};

export default MyApplicationsPage;
