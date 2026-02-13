import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ImageIcon from '@mui/icons-material/Image';

const MAX_IMAGE_SIZE = 700 * 1024; // 700 KB

const NewPostDialog = ({ open, onClose, onSubmit, initialPost }) => {
  const [text, setText] = useState('');
  const [imageData, setImageData] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialPost) {
      setText(initialPost.text || '');
      setImageData(initialPost.imageUrl || '');
    } else {
      setText('');
      setImageData('');
    }
    setError('');
    setDragActive(false);
  }, [initialPost, open]);

  const readFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image too large. Please use an image under 700 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result);
      setError('');
    };
    reader.onerror = () => setError('Unable to read image.');
    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    readFile(file);
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({
      text: text.trim(),
      imageUrl: imageData || ''
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {initialPost ? 'Edit post' : 'New post'}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField
          label="Share something"
          multiline
          minRows={4}
          value={text}
          onChange={(event) => setText(event.target.value)}
          fullWidth
        />

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Add an image
          </Typography>
          <Box
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              border: '1px dashed rgba(255, 173, 153, 0.6)',
              borderRadius: 20,
              p: 2,
              textAlign: 'center',
              backgroundColor: dragActive ? 'rgba(255, 173, 153, 0.15)' : '#FFFDFC',
              cursor: 'pointer'
            }}
          >
            <ImageIcon sx={{ color: 'primary.main', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Drag & drop an image here, or click to upload from camera roll.
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Max size 700 KB
            </Typography>
          </Box>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => readFile(event.target.files?.[0])}
            style={{ display: 'none' }}
          />
          <Button
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            sx={{ mt: 1 }}
            onClick={() => fileInputRef.current?.click()}
          >
            Upload image
          </Button>
        </Box>

        {error && <Alert severity="warning">{error}</Alert>}

        {imageData && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Image preview
            </Typography>
            <Box
              component="img"
              src={imageData}
              alt="Preview"
              sx={{
                width: '100%',
                borderRadius: 20,
                border: '1px solid rgba(255, 173, 153, 0.4)'
              }}
            />
            <Button onClick={() => setImageData('')} sx={{ mt: 1 }}>
              Remove image
            </Button>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialPost ? 'Save changes' : 'Post'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewPostDialog;
