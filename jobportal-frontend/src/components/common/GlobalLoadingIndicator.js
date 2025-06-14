import React from 'react';
import { useLoading } from '../../contexts/LoadingContext'; // Adjust path as needed
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const GlobalLoadingIndicator = () => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <Backdrop
      sx={{ 
        color: '#fff', 
        zIndex: (theme) => theme.zIndex.drawer + 9999, // Ensure it's on top of everything
        display: 'flex',
        flexDirection: 'column'
      }}
      open={isLoading}
    >
      <CircularProgress color="inherit" size={60} />
      <Typography sx={{ mt: 2, fontSize: '1.2rem' }}>
        {loadingMessage || 'Loading...'}
      </Typography>
    </Backdrop>
  );
};

export default GlobalLoadingIndicator;
