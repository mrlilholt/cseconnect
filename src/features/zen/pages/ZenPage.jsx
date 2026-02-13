import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Snackbar, Alert, Skeleton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../../lib/auth';
import { createZenMoment, deleteZenMoment, subscribeToZenMoments, updateZenMoment } from '../api';
import ZenDialog from '../components/ZenDialog';
import ZenCard from '../components/ZenCard';
import EmptyState from '../../../components/EmptyState';

const ZenPage = () => {
  const { user } = useAuth();
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMoment, setEditingMoment] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const unsub = subscribeToZenMoments((items) => {
      setMoments(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = async (payload) => {
    try {
      await createZenMoment({ ...payload, user });
      setDialogOpen(false);
      showMessage('Moment shared.');
    } catch (error) {
      showMessage(error.message || 'Unable to share moment.', 'error');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateZenMoment(editingMoment.id, payload);
      setEditingMoment(null);
      setDialogOpen(false);
      showMessage('Moment updated.');
    } catch (error) {
      showMessage(error.message || 'Unable to update moment.', 'error');
    }
  };

  const handleDelete = async (momentId) => {
    try {
      await deleteZenMoment(momentId);
      showMessage('Moment deleted.');
    } catch (error) {
      showMessage(error.message || 'Unable to delete moment.', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Moments of ZEN
          </Typography>
          <Typography color="text.secondary">
            Capture calm, gratitude, or small wins from the department.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Share moment
        </Button>
      </Box>

      {loading ? (
        <Grid container spacing={2}>
          {[0, 1, 2].map((item) => (
            <Grid item xs={12} md={6} key={item}>
              <Skeleton height={180} />
            </Grid>
          ))}
        </Grid>
      ) : moments.length === 0 ? (
        <EmptyState title="No moments yet" subtitle="Share the first moment of calm." />
      ) : (
        <Grid container spacing={2}>
          {moments.map((moment) => (
            <Grid item xs={12} md={6} key={moment.id}>
              <ZenCard
                moment={moment}
                canEdit={moment.authorUid === user.uid}
                onEdit={(item) => {
                  setEditingMoment(item);
                  setDialogOpen(true);
                }}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <ZenDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingMoment(null);
        }}
        onSubmit={editingMoment ? handleUpdate : handleCreate}
        initialMoment={editingMoment}
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

export default ZenPage;
