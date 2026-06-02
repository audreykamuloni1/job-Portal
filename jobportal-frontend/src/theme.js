import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f766e', // Deep Teal (high-contrast, professional)
      light: '#14b8a6', // Vibrant Teal
      dark: '#115e59',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748b', // Slate Gray
      light: '#94a3b8',
      dark: '#475569',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Ultra-clean background
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a', // Deep charcoal
      secondary: '#475569', // Muted gray
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 800,
      color: '#0f172a',
    },
    h2: {
      fontWeight: 700,
      color: '#0f172a',
    },
    h3: {
      fontWeight: 700,
      color: '#0f172a',
    },
    h4: {
      fontWeight: 600,
      color: '#0f172a',
    },
    h5: {
      fontWeight: 600,
      color: '#0f172a',
    },
    h6: {
      fontWeight: 600,
      color: '#0f172a',
    },
    body1: {
      color: '#334155',
    },
    button: {
      textTransform: 'none', // Premium clean text, no uppercase screaming
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Premium rounded controls
          padding: '8px 18px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(15, 118, 110, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Premium rounded cards
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)', // Sleek modern shadows
          border: '1px solid #f1f5f9',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px -4px rgba(15, 23, 42, 0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
        },
      },
    },
  },
});

export default theme;
