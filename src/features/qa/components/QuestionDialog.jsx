import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {initialQuestion ? 'Edit question' : 'New question'}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <TextField
          label="Question details"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          multiline
          minRows={4}
        />
        <TagInput tags={tags} onChange={setTags} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialQuestion ? 'Save changes' : 'Post question'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionDialog;
