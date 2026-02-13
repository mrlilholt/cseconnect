import React from 'react';
import { Alert } from '@mui/material';

const SmsStatusBanner = ({ status }) => {
  if (!status) return null;

  if (status.type === 'skipped') {
    return (
      <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
        SMS not configured. Alert saved in Firestore only.
      </Alert>
    );
  }

  if (status.type === 'failed') {
    return (
      <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
        SMS failed to send. {status.message}
      </Alert>
    );
  }

  if (status.type === 'sent') {
    return (
      <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
        SMS sent to all available phone numbers.
      </Alert>
    );
  }

  return null;
};

export default SmsStatusBanner;
