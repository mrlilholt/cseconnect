import React from 'react';
import Alert from '../../../components/ui/Alert';

const SmsStatusBanner = ({ status }) => {
  if (!status) return null;

  if (status.type === 'skipped') {
    return (
      <Alert variant="warning" className="mb-3">
        SMS not configured. Alert saved in Firestore only.
      </Alert>
    );
  }

  if (status.type === 'failed') {
    return (
      <Alert variant="error" className="mb-3">
        SMS failed to send. {status.message}
      </Alert>
    );
  }

  if (status.type === 'sent') {
    return (
      <Alert variant="success" className="mb-3">
        SMS sent to all available phone numbers.
      </Alert>
    );
  }

  return null;
};

export default SmsStatusBanner;
