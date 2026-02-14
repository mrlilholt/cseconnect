import React, { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const NewChannelDialog = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name.trim());
    setName('');
  };

  return (
    <Modal
      open={open}
      title="New channel"
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            Create
          </Button>
        </>
      }
    >
      <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Channel name" />
    </Modal>
  );
};

export default NewChannelDialog;
