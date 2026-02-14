import React, { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import TagInput from '../../../components/TagInput';

const QuestionDialog = ({ open, onClose, onSubmit, initialQuestion }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (initialQuestion) {
      setTitle(initialQuestion.title || '');
      setBody(initialQuestion.body || '');
      setTags(initialQuestion.tags || []);
    } else {
      setTitle('');
      setBody('');
      setTags([]);
    }
  }, [initialQuestion, open]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      body: body.trim(),
      tags
    });
  };

  return (
    <Modal
      open={open}
      title={initialQuestion ? 'Edit question' : 'Ask a question'}
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {initialQuestion ? 'Save changes' : 'Post question'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Question title" />
        <Textarea rows={4} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Question details" />
        <TagInput tags={tags} onChange={setTags} />
      </div>
    </Modal>
  );
};

export default QuestionDialog;
