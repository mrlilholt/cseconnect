import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        Page not found
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        This page does not exist. Head back to the dashboard.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}
      >
        Go to dashboard
      </Button>
    </Box>
  );
};

export default NotFoundPage;
