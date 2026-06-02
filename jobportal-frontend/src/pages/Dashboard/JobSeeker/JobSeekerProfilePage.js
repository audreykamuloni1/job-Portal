import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAuth } from '../../../contexts/AuthContext'; // Path to AuthContext
import { useLoading } from '../../../contexts/LoadingContext';
import { showSuccessToast, showErrorToast } from '../../../utils/notifications';
import profileService from '../../../services/profileService';

const JobSeekerProfilePage = () => {
  const { user, setUser: setAuthUser } = useAuth(); // Get user from AuthContext, and a way to update it if needed
  const { showLoading, hideLoading } = useLoading();
  
  const [profile, setProfile] = useState({
    fullName: '', email: '', contactPhone: '', headline: '',
    skillsSummary: '', education: '', experience: '', resumeFilename: null,
  });
  const [originalProfile, setOriginalProfile] = useState(null); // For reverting changes on cancel
  const [resumeFile, setResumeFile] = useState(null); // For new resume upload
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    showLoading('Fetching profile...');
    try {
      const data = await profileService.getJobSeekerProfile();
      // Ensure email from auth context is preserved if backend doesn't send it or if it should be immutable
      const userEmail = user?.email || data.email; // Prioritize auth context email if available
      const fullProfile = { ...data, email: userEmail };
      setProfile(fullProfile);
      setOriginalProfile(fullProfile); // Store a copy for "cancel" functionality
    } catch (error) {
      showErrorToast(error.message || 'Failed to fetch profile.');
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (user) { // Ensure user is loaded before fetching profile
        fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Rerun if user object changes (e.g. after login)

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Only allow changes if in edit mode
    if (isEditing) {
        setProfile(prevProfile => ({
        ...prevProfile,
        [name]: value,
        }));
    }
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file); // 'resume' should match backend expected key
    showLoading('Uploading resume...');
    try {
      const response = await profileService.uploadResume(formData); // Use existing service which takes FormData
      showSuccessToast(response.message || 'Resume uploaded successfully!');
      // Update profile state with new resume filename from response
      // Or refetch profile to get the latest data including new resume filename
      fetchProfile(); 
    } catch (error) {
      showErrorToast(error.message || 'Resume upload failed.');
    } finally {
      hideLoading();
      setResumeFile(null); // Clear the selected file input
    }
  };
  
  // This is triggered by the hidden file input's onChange
  const onFileSelectedForResume = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setResumeFile(file); // Keep track of selected file
      // Immediately upload the resume when a new file is selected
      handleResumeUpload(file); 
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    showLoading('Saving profile...');
    try {
      // Exclude resumeFile from profileData sent to updateJobSeekerProfile if it's handled separately
      // eslint-disable-next-line no-unused-vars
      const { resumeFilename, ...profileDataToUpdate } = profile;
      const updatedProfile = await profileService.updateJobSeekerProfile(profileDataToUpdate);
      showSuccessToast('Profile updated successfully!');
      setProfile(updatedProfile); // Update with response which might contain backend-processed data
      setOriginalProfile(updatedProfile);
      setIsEditing(false);

      // Optionally update AuthContext if relevant info (e.g., fullName) changed
      if (user && (user.username !== updatedProfile.fullName)) { // Assuming username in auth is fullName
        const newAuthUser = { ...user, username: updatedProfile.fullName };
        setAuthUser(newAuthUser); // Update user in AuthContext
        localStorage.setItem('userData', JSON.stringify(newAuthUser)); // Update localStorage
      }

    } catch (error) {
      showErrorToast(error.message || 'Failed to update profile.');
    } finally {
      hideLoading();
    }
  };

  const handleCancelEdit = () => {
    setProfile(originalProfile); // Revert to original fetched data
    setIsEditing(false);
    setResumeFile(null); // Clear any selected resume file not yet uploaded
  };
  
  const handleEditToggle = () => {
    if (isEditing) { // If currently editing, then "Cancel" was clicked
        handleCancelEdit();
    } else { // If not editing, then "Edit Profile" was clicked
        setIsEditing(true);
    }
  };


  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        My Profile
      </Typography>
      
      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{ p: {xs: 2, md: 4}, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="outlined" onClick={handleEditToggle}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
        </Box>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Personal Information</Typography>
            <Divider sx={{mb:2}}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={profile.email || ''} // Ensure value is not null/undefined
              variant="filled" 
              InputProps={{ readOnly: true }} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Phone"
              name="contactPhone"
              value={profile.contactPhone}
              onChange={handleChange}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Headline (e.g., Aspiring Marketing Professional)"
              name="headline"
              value={profile.headline}
              onChange={handleChange}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
            />
          </Grid>

          {/* Professional Summary */}
          <Grid item xs={12} sx={{mt:2}}>
            <Typography variant="h6" gutterBottom>Professional Summary</Typography>
            <Divider sx={{mb:2}}/>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Skills Summary"
              name="skillsSummary"
              multiline
              rows={4}
              value={profile.skillsSummary}
              onChange={handleChange}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
              placeholder="List your key skills, technologies, and expertise."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Education"
              name="education"
              multiline
              rows={3}
              value={profile.education}
              onChange={handleChange}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
              placeholder="e.g., BSc in Computer Science - University of Example (2020)"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Experience"
              name="experience"
              multiline
              rows={5}
              value={profile.experience}
              onChange={handleChange}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
              placeholder="e.g., Software Engineer at Tech Corp (Jan 2021 - Present)\n- Developed awesome features..."
            />
          </Grid>

          {/* Resume Section */}
          <Grid item xs={12} sx={{mt:2}} id="resume">
            <Typography variant="h6" gutterBottom>Resume</Typography>
            <Divider sx={{mb:2}}/>
          </Grid>
          <Grid item xs={12}>
            {profile.resumeFilename ? ( // Check profile.resumeFilename from fetched data
              <Typography sx={{mb:1}}>Current resume: <strong>{profile.resumeFilename}</strong></Typography>
            ) : (
              <Typography sx={{mb:1}}>No resume uploaded.</Typography>
            )}
            {isEditing && (
                <Button
                  variant="outlined"
                  component="label" 
                  startIcon={<CloudUploadIcon />}
                  sx={{mt:1}}
                >
                  {resumeFile ? `Uploading: ${resumeFile.name}` : "Change/Upload Resume"}
                  <input
                      type="file"
                      hidden
                      onChange={onFileSelectedForResume} // Changed to direct upload handler
                      accept=".pdf,.doc,.docx" 
                  />
                </Button>
            )}
          </Grid>
          
          {isEditing && (
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
                <Button type="submit" variant="contained" color="primary" size="large" disabled={!isEditing}>
                  Save Profile Changes
                </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default JobSeekerProfilePage;