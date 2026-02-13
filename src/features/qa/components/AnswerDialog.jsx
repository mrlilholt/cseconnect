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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {initialAnswer ? 'Edit answer' : 'New answer'}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <TextField
          label="Answer"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          multiline
          minRows={4}
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialAnswer ? 'Save changes' : 'Add answer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnswerDialog;
