import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { createTube, deleteTube, subscribeToTubes, updateTube } from '../api';
import TubeDialog from '../components/TubeDialog';
import TubeCard from '../components/TubeCard';
import EmptyState from '../../../components/EmptyState';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';

const TubesPage = () => {
  const { user } = useAuth();
  const [tubes, setTubes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTube, setEditingTube] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    const unsub = subscribeToTubes((items) => {
      setTubes(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showMessage = (message) => {
    setSnackbar({ message });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const handleCreate = async (payload) => {
    try {
      await createTube({ ...payload, user });
      setDialogOpen(false);
      showMessage('Tube shared.');
    } catch (error) {
      showMessage(error.message || 'Unable to share tube.');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateTube(editingTube.id, payload);
      setEditingTube(null);
      setDialogOpen(false);
      showMessage('Tube updated.');
    } catch (error) {
      showMessage(error.message || 'Unable to update tube.');
    }
  };

  const handleDelete = async (tubeId) => {
    try {
      await deleteTube(tubeId);
      showMessage('Tube deleted.');
    } catch (error) {
      showMessage(error.message || 'Unable to delete tube.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gradient">Tubes</h2>
          <p className="text-sm text-white/50">Share YouTube videos and demos with the team.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus size={14} />
          Share tube
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-40 w-full" />
          ))}
        </div>
      ) : tubes.length === 0 ? (
        <EmptyState title="No tubes yet" subtitle="Share the first YouTube link with the team." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tubes.map((tube) => (
            <TubeCard
              key={tube.id}
              tube={tube}
              canEdit={tube.authorUid === user.uid}
              onEdit={(item) => {
                setEditingTube(item);
                setDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
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

      {snackbar && (
        <div className="fixed bottom-24 right-6 rounded-[2px] border border-white/10 bg-black/70 px-4 py-2 text-xs text-white/80">
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default TubesPage;
