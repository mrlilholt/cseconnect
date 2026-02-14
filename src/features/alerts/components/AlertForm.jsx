import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';

const AlertForm = ({ onSubmit, sending }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) return;
    onSubmit(message.trim());
    setMessage('');
  };

  return (
    <div className="space-y-3">
      <Textarea
        rows={3}
        placeholder="All hands on deck: lab access issue."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <Button onClick={handleSubmit} disabled={sending}>
        <Send size={14} />
        Broadcast alert
      </Button>
    </div>
  );
};

export default AlertForm;
