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

const LinkDialog = ({ open, onClose, onSubmit, initialLink }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (initialLink) {
      setTitle(initialLink.title || '');
      setUrl(initialLink.url || '');
      setDescription(initialLink.description || '');
      setTags(initialLink.tags || []);
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setTags([]);
    }
  }, [initialLink, open]);

  const handleSubmit = () => {
    if (!title.trim() || !url.trim()) return;
    onSubmit({
      title: title.trim(),
      url: url.trim(),
      description: description.trim(),
      tags
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {initialLink ? 'Edit link' : 'Save link'}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <TextField label="URL" value={url} onChange={(event) => setUrl(event.target.value)} />
        <TextField
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          multiline
          minRows={3}
        />
        <TagInput tags={tags} onChange={setTags} />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialLink ? 'Save changes' : 'Save link'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkDialog;
