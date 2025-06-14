import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import { useLoading } from '../../contexts/LoadingContext'; // Import useLoading
import { showSuccessToast, showErrorToast } from '../../utils/notifications'; // Import toasts

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('ROLE_JOB_SEEKER'); // Ensure roles match backend (e.g. ROLE_ prefix)
  const { register } = useAuth(); // Get register function from AuthContext
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      showErrorToast('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      showErrorToast("Passwords don't match!");
      return;
    }
    
    showLoading('Registering...');
    try {
      // Construct userData matching backend expectations (e.g. userType vs role)
      // The existing authService.register just passes userData through.
      // The backend /api/auth/register expects "username", "email", "password", "userType" (which then becomes a role)
      await register({ username, email, password, userType });
      showSuccessToast('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      showErrorToast(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
    } finally {
      hideLoading();
    }
  };

  return (
    <Container component="main" maxWidth="sm"> {/* Changed to sm for a slightly wider form */}
      <Paper 
        elevation={3} 
        sx={{ 
          marginTop: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: 4 
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" required>
                <FormLabel component="legend">Register as:</FormLabel>
                <RadioGroup
                  row
                  aria-label="userType"
                  name="userType"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <FormControlLabel value="ROLE_JOB_SEEKER" control={<Radio />} label="Job Seeker" />
                  <FormControlLabel value="ROLE_EMPLOYER" control={<Radio />} label="Employer" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;