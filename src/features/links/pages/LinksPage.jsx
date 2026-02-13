import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Snackbar, Alert, Skeleton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../../lib/auth';
import { createLink, deleteLink, subscribeToLinks, updateLink } from '../api';
import LinkDialog from '../components/LinkDialog';
import LinkCard from '../components/LinkCard';
import EmptyState from '../../../components/EmptyState';

const LinksPage = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const unsub = subscribeToLinks((items) => {
      setLinks(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = async (payload) => {
    try {
      await createLink({ ...payload, authorUid: user.uid });
      setDialogOpen(false);
      showMessage('Link saved.');
    } catch (error) {
      showMessage(error.message || 'Unable to save link.', 'error');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateLink(editingLink.id, payload);
      setEditingLink(null);
      setDialogOpen(false);
      showMessage('Link updated.');
    } catch (error) {
      showMessage(error.message || 'Unable to update link.', 'error');
    }
  };

  const handleDelete = async (linkId) => {
    try {
      await deleteLink(linkId);
      showMessage('Link deleted.');
    } catch (error) {
      showMessage(error.message || 'Unable to delete link.', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Saved Links
          </Typography>
          <Typography color="text.secondary">Curate articles and videos for the team.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Save link
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={2}>
          {[0, 1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              <Skeleton height={160} />
            </Grid>
          ))}
        </Grid>
      ) : links.length === 0 ? (
        <EmptyState title="No links yet" subtitle="Save an article or video for the team." />
      ) : (
        <Grid container spacing={2}>
          {links.map((linkItem) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={linkItem.id}>
              <LinkCard
                linkItem={linkItem}
                canEdit={linkItem.authorUid === user.uid}
                onEdit={(item) => {
                  setEditingLink(item);
                  setDialogOpen(true);
                }}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <LinkDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingLink(null);
        }}
        onSubmit={editingLink ? handleUpdate : handleCreate}
        initialLink={editingLink}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LinksPage;
