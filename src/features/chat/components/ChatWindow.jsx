import React, { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
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
      <Card className="rounded-[2px]">
        <div className="text-center">
          <p className="text-sm font-semibold text-gradient">Select a channel</p>
          <p className="mt-2 text-xs text-white/50">Pick a channel to start chatting.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-[2px] flex h-full flex-col">
      <div>
        <p className="text-sm font-semibold text-white">#{channel.name}</p>
        <p className="text-xs text-white/40">{messages.length} messages</p>
      </div>
      <div className="my-4 h-px w-full bg-white/10" />
      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((message) => {
          const isOwn = message.authorUid === user?.uid;
          return (
            <div key={message.id} className={`max-w-[75%] ${isOwn ? 'ml-auto text-right' : ''}`}>
              <div className={`rounded-[2px] px-3 py-2 text-xs ${isOwn ? 'bg-coral/20 text-white' : 'bg-white/5 text-white/80'}`}>
                <p className="font-semibold text-white/80">{message.authorName || 'Member'}</p>
                <p>{message.text}</p>
              </div>
              <p className="mt-1 text-[10px] text-white/40">{formatDateTime(message.createdAt)}</p>
            </div>
          );
        })}
        {messages.length === 0 && <p className="text-xs text-white/40">No messages yet.</p>}
        <div ref={bottomRef} />
      </div>
      <div className="mt-4 h-px w-full bg-white/10" />
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          className="rounded-full"
          value={messageText}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Write a message"
        />
        <Button size="sm" onClick={onSend}>
          <Send size={14} />
          Send
        </Button>
      </div>
    </Card>
  );
};

export default ChatWindow;
