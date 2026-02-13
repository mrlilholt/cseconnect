import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const AlertForm = ({ onSubmit, sending }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) return;
    onSubmit(message.trim());
    setMessage('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Alert message"
        placeholder="All hands on deck: lab access issue."
        multiline
        minRows={3}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <Button variant="contained" endIcon={<SendIcon />} onClick={handleSubmit} disabled={sending}>
        Broadcast alert
      </Button>
    </Box>
  );
};

export default AlertForm;
