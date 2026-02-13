import React, { useEffect, useRef } from 'react';
import { Box, Button, Divider, Stack, TextField, Typography, Card, CardContent } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { formatDateTime } from '../../../lib/time';
import { useAuth } from '../../../lib/auth';

const ChatWindow = ({ channel, messages, messageText, onChange, onSend }) => {
  const { user } = useAuth();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!channel) {
    return (
      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Select a channel
          </Typography>
          <Typography color="text.secondary">Pick a channel to start chatting.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            #{channel.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {messages.length} message{messages.length === 1 ? '' : 's'}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
          <Stack spacing={2}>
            {messages.map((message) => {
              const isOwn = message.authorUid === user?.uid;
              return (
                <Box
                  key={message.id}
                  sx={{
                    alignSelf: isOwn ? 'flex-end' : 'flex-start',
                    maxWidth: '75%'
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: isOwn ? 'rgba(255, 125, 110, 0.2)' : 'rgba(255, 173, 153, 0.15)'
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {message.authorName || 'Member'}
                    </Typography>
                    <Typography>{message.text}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(message.createdAt)}
                  </Typography>
                </Box>
              );
            })}
            {messages.length === 0 && (
              <Typography color="text.secondary">No messages yet.</Typography>
            )}
            <div ref={bottomRef} />
          </Stack>
        </Box>
        <Divider />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ pt: 2 }}>
          <TextField
            value={messageText}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Write a message"
            fullWidth
            size="small"
          />
          <Button variant="contained" endIcon={<SendIcon />} onClick={onSend}>
            Send
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ChatWindow;
