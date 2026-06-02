import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00796B', // Teal
    },
    secondary: {
      main: '#9E9E9E', // Neutral Gray
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica", "Arial", sans-serif',
    // You can add h1-h6, body1, etc. overrides here if needed later
  },
});

export default theme;
