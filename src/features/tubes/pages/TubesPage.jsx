import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Snackbar, Alert, Skeleton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../../lib/auth';
import { createTube, deleteTube, subscribeToTubes, updateTube } from '../api';
import TubeDialog from '../components/TubeDialog';
import TubeCard from '../components/TubeCard';
import EmptyState from '../../../components/EmptyState';

const TubesPage = () => {
  const { user } = useAuth();
  const [tubes, setTubes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTube, setEditingTube] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const unsub = subscribeToTubes((items) => {
      setTubes(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = async (payload) => {
    try {
      await createTube({ ...payload, user });
      setDialogOpen(false);
      showMessage('Tube shared.');
    } catch (error) {
      showMessage(error.message || 'Unable to share tube.', 'error');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateTube(editingTube.id, payload);
      setEditingTube(null);
      setDialogOpen(false);
      showMessage('Tube updated.');
    } catch (error) {
      showMessage(error.message || 'Unable to update tube.', 'error');
    }
  };

  const handleDelete = async (tubeId) => {
    try {
      await deleteTube(tubeId);
      showMessage('Tube deleted.');
    } catch (error) {
      showMessage(error.message || 'Unable to delete tube.', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Tubes
          </Typography>
          <Typography color="text.secondary">Share YouTube videos and demos with the team.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Share tube
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
      ) : tubes.length === 0 ? (
        <EmptyState title="No tubes yet" subtitle="Share the first YouTube link with the team." />
      ) : (
        <Grid container spacing={2}>
          {tubes.map((tube) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tube.id}>
              <TubeCard
                tube={tube}
                canEdit={tube.authorUid === user.uid}
                onEdit={(item) => {
                  setEditingTube(item);
                  setDialogOpen(true);
                }}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <TubeDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingTube(null);
        }}
        onSubmit={editingTube ? handleUpdate : handleCreate}
        initialTube={editingTube}
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

export default TubesPage;
