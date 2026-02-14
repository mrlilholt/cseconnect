import React, { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';

const AnswerDialog = ({ open, onClose, onSubmit, initialAnswer }) => {
  const [body, setBody] = useState('');

  useEffect(() => {
    if (initialAnswer) {
      setBody(initialAnswer.body || '');
    } else {
      setBody('');
    }
  }, [initialAnswer, open]);

  const handleSubmit = () => {
    if (!body.trim()) return;
    onSubmit({ body: body.trim() });
  };

  return (
    <Modal
      open={open}
      title={initialAnswer ? 'Edit answer' : 'Add answer'}
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {initialAnswer ? 'Save changes' : 'Post answer'}
          </Button>
        </>
      }
    >
      <Textarea rows={4} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Your answer" />
    </Modal>
  );
};

export default AnswerDialog;
