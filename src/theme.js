import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF7D6E',
      dark: '#F26459',
      light: '#FFB3A7'
    },
    secondary: {
      main: '#FFAD99'
    },
    background: {
      default: '#FFF7F4',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#3B2F2A',
      secondary: '#7B6F6A'
    },
    success: {
      main: '#2D9C78'
    },
    warning: {
      main: '#F2B166'
    },
    error: {
      main: '#E0634E'
    }
  },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 }
  },
  shape: {
    borderRadius: 24
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FFF7F4'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 14px 40px rgba(255, 125, 110, 0.12)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 20,
          boxShadow: 'none'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined'
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: '#FFFDFC'
        },
        notchedOutline: {
          borderColor: 'rgba(255, 173, 153, 0.5)'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 14px 30px rgba(255, 125, 110, 0.35)'
        }
      }
    }
  }
});

export default theme;
