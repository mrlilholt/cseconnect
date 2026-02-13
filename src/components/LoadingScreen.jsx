import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = ({ label = 'Loading...' }) => (
  <Box
    sx={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2
    }}
  >
    <CircularProgress />
    <Typography color="text.secondary">{label}</Typography>
  </Box>
);

export default LoadingScreen;
