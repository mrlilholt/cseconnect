import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TagInput from '../../../components/TagInput';
import { extractYouTubeId, getYouTubeThumbnail } from '../utils';

const TubeDialog = ({ open, onClose, onSubmit, initialTube }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTube) {
      setTitle(initialTube.title || '');
      setUrl(initialTube.url || '');
      setDescription(initialTube.description || '');
      setTags(initialTube.tags || []);
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setTags([]);
    }
    setError('');
  }, [initialTube, open]);

  const videoId = useMemo(() => extractYouTubeId(url), [url]);
  const thumbnail = useMemo(() => getYouTubeThumbnail(videoId), [videoId]);

  const handleSubmit = () => {
    setError('');
    if (!title.trim() || !url.trim()) return;
    if (!videoId) {
      setError('Enter a valid YouTube URL.');
      return;
    }
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
        {initialTube ? 'Edit tube' : 'Share a tube'}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <TextField
          label="YouTube URL"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
        {thumbnail && (
          <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255, 173, 153, 0.3)' }}>
            <Box component="img" src={thumbnail} alt="Video preview" sx={{ width: '100%', display: 'block' }} />
          </Box>
        )}
        <TextField
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          multiline
          minRows={3}
        />
        <TagInput tags={tags} onChange={setTags} label="Tags" />
        {error && <Alert severity="warning">{error}</Alert>}
        {!videoId && url.trim().length > 0 && (
          <Typography variant="caption" color="text.secondary">
            Supported formats: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialTube ? 'Save changes' : 'Share tube'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TubeDialog;
