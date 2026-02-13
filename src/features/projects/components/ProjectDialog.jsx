import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  IconButton,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

const statusOptions = [
  { value: 'idea', label: 'Idea' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'done', label: 'Done' }
];

const ProjectDialog = ({ open, onClose, onSubmit, initialProject }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('idea');
  const [links, setLinks] = useState([{ label: '', url: '' }]);

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title || '');
      setDescription(initialProject.description || '');
      setStatus(initialProject.status || 'idea');
      setLinks(initialProject.links?.length ? initialProject.links : [{ label: '', url: '' }]);
    } else {
      setTitle('');
      setDescription('');
      setStatus('idea');
      setLinks([{ label: '', url: '' }]);
    }
  }, [initialProject, open]);

  const updateLink = (index, field, value) => {
    const next = [...links];
    next[index] = { ...next[index], [field]: value };
    setLinks(next);
  };

  const addLink = () => setLinks([...links, { label: '', url: '' }]);

  const removeLink = (index) => {
    setLinks(links.filter((_, idx) => idx !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const sanitizedLinks = links.filter((link) => link.label.trim() && link.url.trim());
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      links: sanitizedLinks
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {initialProject ? 'Edit project' : 'New project'}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <TextField
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          multiline
          minRows={3}
        />
        <TextField
          select
          label="Status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Box sx={{ fontWeight: 600 }}>Links</Box>
            <Button onClick={addLink}>Add link</Button>
          </Stack>
          <Stack spacing={1}>
            {links.map((link, index) => (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} key={`${index}-${link.label}`}>
                <TextField
                  label="Label"
                  value={link.label}
                  onChange={(event) => updateLink(index, 'label', event.target.value)}
                  fullWidth
                />
                <TextField
                  label="URL"
                  value={link.url}
                  onChange={(event) => updateLink(index, 'url', event.target.value)}
                  fullWidth
                />
                {links.length > 1 && (
                  <IconButton onClick={() => removeLink(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                )}
              </Stack>
            ))}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialProject ? 'Save changes' : 'Create project'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectDialog;
