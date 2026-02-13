import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const AccessDeniedPage = () => {
  const navigate = useNavigate();
  const { deniedEmail } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2
      }}
    >
      <Card sx={{ maxWidth: 520, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
            Access not granted
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {deniedEmail
              ? `The account ${deniedEmail} is not on the department allowlist.`
              : 'Your account is not on the department allowlist.'}
          </Typography>
          <Button variant="contained" onClick={() => navigate('/signin')}>
            Back to sign in
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccessDeniedPage;
