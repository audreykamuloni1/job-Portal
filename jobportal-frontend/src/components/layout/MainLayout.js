import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default MainLayout;
