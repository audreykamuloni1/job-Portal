import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import applicationService from '../../services/applicationService'; // Adjust path as needed
import { showSuccessToast, showErrorToast } from '../../utils/notifications'; // Adjust path
// No global loading context here, local loading for modal action

const ApplyJobModal = ({ open, onClose, jobId, jobTitle }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitApplication = async () => {
    if (!coverLetter.trim()) {
      showErrorToast('Please provide a cover letter.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Existing service expects applicationDTO: { jobId, coverLetter }
      const response = await applicationService.applyToJob({ jobId, coverLetter });
      // Existing service returns full response, so access data property
      showSuccessToast(response.data.message || 'Application submitted successfully!');
      setCoverLetter(''); // Clear field
      onClose(true); // Pass true to indicate success
    } catch (error) {
      // Error structure from existing service might be error.response.data.message
      showErrorToast(error.response?.data?.message || error.message || 'Failed to submit application.');
      onClose(false); // Pass false to indicate failure
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while submitting
    setCoverLetter(''); // Reset cover letter on close
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Apply for: {jobTitle || 'this job'}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{mb: 2}}>
          Please write a compelling cover letter to accompany your application.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="coverLetter"
          label="Cover Letter"
          type="text"
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          disabled={isSubmitting}
        />
      </DialogContent>
      <DialogActions sx={{ p: '16px 24px' }}>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmitApplication} 
          variant="contained" 
          color="primary" 
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplyJobModal;
