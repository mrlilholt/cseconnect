import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, Snackbar, Alert, Skeleton, Typography } from '@mui/material';
import { useAuth } from '../../../lib/auth';
import { createChannel, sendMessage, subscribeToChannels, subscribeToMessages } from '../api';
import ChannelList from '../components/ChannelList';
import ChatWindow from '../components/ChatWindow';
import NewChannelDialog from '../components/NewChannelDialog';

const ChatPage = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const lastSeenMessageRef = useRef({});

  useEffect(() => {
    const unsub = subscribeToChannels((items) => {
      setChannels(items);
      setLoading(false);
      setSelectedChannel((prev) => {
        if (prev) {
          return items.find((item) => item.id === prev.id) || items[0] || null;
        }
        return items[0] || null;
      });
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!selectedChannel) return () => {};
    const unsub = subscribeToMessages(selectedChannel.id, setMessages);
    return () => unsub();
  }, [selectedChannel]);

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    if (!selectedChannel || messages.length === 0) return;
    const lastMessage = messages[messages.length - 1];
    const channelId = selectedChannel.id;
    const lastSeenId = lastSeenMessageRef.current[channelId];

    if (!lastSeenId) {
      lastSeenMessageRef.current[channelId] = lastMessage.id;
      return;
    }

    if (lastSeenId !== lastMessage.id) {
      if (lastMessage.authorUid !== user?.uid) {
        const snippet = lastMessage.text?.slice(0, 60) || 'New message';
        showMessage(`New in #${selectedChannel.name}: ${snippet}`, 'info');
      }
      lastSeenMessageRef.current[channelId] = lastMessage.id;
    }
  }, [messages, selectedChannel, user]);

  const handleCreateChannel = async (name) => {
    try {
      await createChannel(name);
      setDialogOpen(false);
      showMessage('Channel created.');
    } catch (error) {
      showMessage(error.message || 'Unable to create channel.', 'error');
    }
  };

  const handleSend = async () => {
    if (!messageText.trim() || !selectedChannel) return;
    try {
      await sendMessage(selectedChannel.id, {
        authorUid: user.uid,
        authorName: user.displayName || user.email,
        text: messageText.trim()
      });
      setMessageText('');
    } catch (error) {
      showMessage(error.message || 'Unable to send message.', 'error');
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Group Chat
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Jump into a channel and keep the conversation moving.
      </Typography>

      {loading ? (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Skeleton height={360} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton height={360} />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <ChannelList
              channels={channels}
              selectedId={selectedChannel?.id}
              onSelect={setSelectedChannel}
              onCreate={() => setDialogOpen(true)}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <ChatWindow
              channel={selectedChannel}
              messages={messages}
              messageText={messageText}
              onChange={setMessageText}
              onSend={handleSend}
            />
          </Grid>
        </Grid>
      )}

      <NewChannelDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateChannel}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChatPage;
