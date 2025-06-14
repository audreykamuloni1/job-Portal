import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3, 
        px: 2, 
        mt: 'auto', 
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        borderTop: (theme) => `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} JobPortal Malawi. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
