import React, { useState, useEffect, useCallback } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import applicationService from '../../../services/applicationService';
import jobService from '../../../services/jobService'; // To fetch job title
import { useLoading } from '../../../contexts/LoadingContext';
import { showSuccessToast, showErrorToast } from '../../../utils/notifications';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';

const applicationStatuses = [
  "PENDING",
  "VIEWED",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "OFFER_EXTENDED",
  "REJECTED",
  "HIRED"
];

const getStatusChipColor = (status) => {
  if (!status) return 'default';
  switch (status.toUpperCase()) {
    case 'PENDING': return 'default';
    case 'VIEWED': return 'info';
    case 'SHORTLISTED': return 'secondary';
    case 'INTERVIEW_SCHEDULED': return 'primary';
    case 'OFFER_EXTENDED': return 'success';
    case 'HIRED': return 'success';
    case 'REJECTED': return 'error';
    default: return 'default';
  }
};

const ViewApplicantsPage = () => {
  const { jobId } = useParams();
  const [jobTitle, setJobTitle] = useState('');
  const [applicants, setApplicants] = useState([]);
  const { showLoading, hideLoading, isLoading } = useLoading();

  const fetchJobAndApplicants = useCallback(async () => {
    if (!jobId) return;
    showLoading('Loading applicants...');
    try {
      const jobDetails = await jobService.getJobById(jobId);
      setJobTitle(jobDetails?.title || `Job ID: ${jobId}`);
      const applicationsResponse = await applicationService.getApplicationsByJob(jobId);
      setApplicants(applicationsResponse.data || []);
    } catch (error) {
      showErrorToast(error.message || 'Failed to load job or applicant data.');
      setApplicants([]);
    } finally {
      hideLoading();
    }
  }, [jobId, showLoading, hideLoading]);

  useEffect(() => {
    fetchJobAndApplicants();
  }, [fetchJobAndApplicants]);

  const handleStatusChange = async (applicationId, newStatus) => {
    showLoading('Updating status...');
    try {
      const response = await applicationService.updateApplicationStatus(applicationId, newStatus);
      showSuccessToast(response.message || 'Application status updated successfully!');
      setApplicants(prevApplicants =>
        prevApplicants.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      showErrorToast(error.response?.data?.message || error.message || 'Failed to update status.');
    } finally {
      hideLoading();
    }
  };

  if (isLoading && applicants.length === 0) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading applicants...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Applicants for: {jobTitle}
        </Typography>
        <Button variant="outlined" component={RouterLink} to="/employer/manage-jobs">
          Back to Manage Jobs
        </Button>
      </Box>

      {applicants.length === 0 && !isLoading && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="subtitle1">No applicants found for this job posting yet.</Typography>
        </Paper>
      )}

      {applicants.length > 0 && (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Applicant Name</TableCell>
                <TableCell>Applied Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applicants.map(applicant => (
                <TableRow key={applicant.id}>
                  <TableCell>{applicant.applicantName || applicant.name || 'N/A'}</TableCell>
                  <TableCell>
                    {applicant.appliedDate
                      ? new Date(applicant.appliedDate).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" fullWidth>
                      <Select
                        value={applicant.status}
                        onChange={e =>
                          handleStatusChange(applicant.id, e.target.value)
                        }
                        sx={{ minWidth: 140 }}
                      >
                        {applicationStatuses.map(status => (
                          <MenuItem key={status} value={status}>
                            <Chip
                              label={status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                              color={getStatusChipColor(status)}
                              size="small"
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      component={RouterLink}
                      to={`/employer/applicants/${applicant.id}/profile`}
                    >
                      View Profile
                    </Button>
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

export default ViewApplicantsPage;