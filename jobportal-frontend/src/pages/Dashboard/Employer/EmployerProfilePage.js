import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useAuth } from '../../../contexts/AuthContext'; // Path to AuthContext
import { useLoading } from '../../../contexts/LoadingContext';
import { showSuccessToast, showErrorToast } from '../../../utils/notifications';
import profileService from '../../../services/profileService';

const EmployerProfilePage = () => {
  const { user, setUser: setAuthUser } = useAuth(); // Get user from AuthContext
  const { showLoading, hideLoading } = useLoading();
  
  const [profile, setProfile] = useState({
    companyName: '', email: '', website: '', phone: '', 
    address: '', description: '', industry: '',
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchEmployerProfile = async () => {
    showLoading('Fetching company profile...');
    try {
      const data = await profileService.getEmployerProfile();
      // Preserve email from auth context if backend doesn't reliably return it or if it's immutable
      const userEmail = user?.email || data.email;
      const fullProfile = { ...data, email: userEmail };
      setProfile(fullProfile);
      setOriginalProfile(fullProfile);
    } catch (error) {
      showErrorToast(error.message || 'Failed to fetch company profile.');
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    if (user) { // Fetch profile only if user is available
        fetchEmployerProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (isEditing) {
        setProfile(prevProfile => ({
        ...prevProfile,
        [name]: value,
        }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    showLoading('Saving company profile...');
    try {
      const updatedProfile = await profileService.updateEmployerProfile(profile);
      showSuccessToast('Company profile updated successfully!');
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setIsEditing(false);

      // If companyName is used in AuthContext user object (e.g. as user.username for employers)
      // update it similar to JobSeekerProfilePage
      if (user && user.username !== updatedProfile.companyName && user.roles.includes('ROLE_EMPLOYER')) {
        const newAuthUser = { ...user, username: updatedProfile.companyName }; // Or a specific field like user.companyDisplayName
        setAuthUser(newAuthUser);
        localStorage.setItem('userData', JSON.stringify(newAuthUser));
      }

    } catch (error) {
      showErrorToast(error.message || 'Failed to update company profile.');
    } finally {
      hideLoading();
    }
  };
  
  const handleCancelEdit = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (isEditing) {
        handleCancelEdit();
    } else {
        setIsEditing(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Company Profile
      </Typography>
      
      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{ p: {xs: 2, md: 4}, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="outlined" onClick={handleEditToggle}>
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
        </Box>
        <Grid container spacing={3}>
          {/* Company Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Company Details</Typography>
            <Divider sx={{mb:2}}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={profile.companyName}
              onChange={handleChange}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Email"
              name="email"
              type="email"
              value={profile.email || ''}
              variant="filled" 
              InputProps={{ readOnly: true }} 
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Website"
              name="website"
              type="url"
              value={profile.website}
              onChange={handleChange}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
            />
          </Grid>
           <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Industry"
              name="industry"
              value={profile.industry}
              onChange={handleChange}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
            />
          </Grid>


          {/* Company Description */}
          <Grid item xs={12} sx={{mt:2}}>
            <Typography variant="h6" gutterBottom>About Your Company</Typography>
            <Divider sx={{mb:2}}/>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Description"
              name="description"
              multiline
              rows={5}
              value={profile.description}
              onChange={handleChange}
              variant={isEditing ? "outlined" : "filled"}
              InputProps={{ readOnly: !isEditing }}
              placeholder="Tell us about your company, its mission, vision, and culture."
            />
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

export default EmployerProfilePage;
