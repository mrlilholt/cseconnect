import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyState = ({ title, subtitle }) => (
  <Box sx={{ textAlign: 'center', py: 6 }}>
    <Typography variant="h6" sx={{ fontWeight: 600 }}>
      {title}
    </Typography>
    {subtitle && (
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default EmptyState;
