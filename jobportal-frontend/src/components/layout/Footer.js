import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material'; // Renamed Link to MuiLink to avoid conflict

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3, // Padding top and bottom
        px: 2, // Padding left and right
        mt: 'auto', // Push footer to bottom if content is short
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {'© '}
        <MuiLink color="inherit" href="https://jobportal.mw/"> {/* Replace with actual link if available */}
          JobPortal Malawi
        </MuiLink>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        {/* Optional: Placeholder links */}
        <MuiLink color="inherit" href="/about-us" sx={{ mx: 1 }}>
          About Us
        </MuiLink>
        |
        <MuiLink color="inherit" href="/contact" sx={{ mx: 1 }}>
          Contact
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default Footer;
