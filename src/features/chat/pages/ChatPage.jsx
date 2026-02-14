import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../../lib/auth';
import { createChannel, sendMessage, subscribeToChannels, subscribeToMessages } from '../api';
import ChannelList from '../components/ChannelList';
import ChatWindow from '../components/ChatWindow';
import NewChannelDialog from '../components/NewChannelDialog';
import OnlineUsersPanel from '../../../components/OnlineUsersPanel';
import Alert from '../../../components/ui/Alert';
import Skeleton from '../../../components/ui/Skeleton';

const ChatPage = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
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
        setSnackbar({ message: `New in #${selectedChannel.name}: ${snippet}` });
        setTimeout(() => setSnackbar(null), 3000);
      }
      lastSeenMessageRef.current[channelId] = lastMessage.id;
    }
  }, [messages, selectedChannel, user]);

  const handleCreateChannel = async (name) => {
    try {
      await createChannel(name);
      setDialogOpen(false);
    } catch (error) {
      setSnackbar({ message: error.message || 'Unable to create channel.' });
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
      setSnackbar({ message: error.message || 'Unable to send message.' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gradient">Group Chat</h2>
        <p className="text-sm text-white/50">Jump into a channel and keep the conversation moving.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-4">
            <OnlineUsersPanel title="Online now" max={6} />
            <ChannelList
              channels={channels}
              selectedId={selectedChannel?.id}
              onSelect={setSelectedChannel}
              onCreate={() => setDialogOpen(true)}
            />
          </div>
          <ChatWindow
            channel={selectedChannel}
            messages={messages}
            messageText={messageText}
            onChange={setMessageText}
            onSend={handleSend}
          />
        </div>
      )}

      <NewChannelDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleCreateChannel} />

      {snackbar && (
        <div className="fixed bottom-24 right-6">
          <Alert variant="info">{snackbar.message}</Alert>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
