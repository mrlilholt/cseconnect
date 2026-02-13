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

const ZenDialog = ({ open, onClose, onSubmit, initialMoment }) => {
  const [text, setText] = useState('');

  useEffect(() => {
    if (initialMoment) {
      setText(initialMoment.text || '');
    } else {
      setText('');
    }
  }, [initialMoment, open]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({ text: text.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {initialMoment ? 'Edit moment' : 'Share a moment'}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Moment"
          placeholder="Share something calm, grateful, or grounding."
          multiline
          minRows={4}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialMoment ? 'Save changes' : 'Share moment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ZenDialog;
