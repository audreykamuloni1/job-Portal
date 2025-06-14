import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import applicationService from '../../services/applicationService'; 
import { showSuccessToast, showErrorToast } from '../../utils/notifications'; 


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
      
      const response = await applicationService.applyToJob({ jobId, coverLetter });
     
      showSuccessToast(response.data.message || 'Application submitted successfully!');
      setCoverLetter(''); 
      onClose(true); 
    } catch (error) {
      
      showErrorToast(error.response?.data?.message || error.message || 'Failed to submit application.');
      onClose(false); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return; 
    setCoverLetter(''); 
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
