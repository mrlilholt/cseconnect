import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import {
  createZenMoment,
  deleteZenMoment,
  maybeSeedHourlyQuote,
  subscribeToZenMoments,
  updateZenMoment
} from '../api';
import ZenDialog from '../components/ZenDialog';
import ZenCard from '../components/ZenCard';
import EmptyState from '../../../components/EmptyState';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';

const ZenPage = () => {
  const { user } = useAuth();
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMoment, setEditingMoment] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    const unsub = subscribeToZenMoments((items) => {
      setMoments(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    let mounted = true;
    const seed = () =>
      maybeSeedHourlyQuote().catch(() => {
        if (!mounted) return;
      });
    seed();
    const interval = setInterval(seed, 15 * 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const showMessage = (message) => {
    setSnackbar({ message });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const handleCreate = async (payload) => {
    try {
      await createZenMoment({ ...payload, user });
      setDialogOpen(false);
      showMessage('Moment shared.');
    } catch (error) {
      showMessage(error.message || 'Unable to share moment.');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateZenMoment(editingMoment.id, payload);
      setEditingMoment(null);
      setDialogOpen(false);
      showMessage('Moment updated.');
    } catch (error) {
      showMessage(error.message || 'Unable to update moment.');
    }
  };

  const handleDelete = async (momentId) => {
    try {
      await deleteZenMoment(momentId);
      showMessage('Moment deleted.');
    } catch (error) {
      showMessage(error.message || 'Unable to delete moment.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gradient">Moments of ZEN</h2>
          <p className="text-sm text-white/50">Capture calm, gratitude, or small wins.</p>
          <p className="mt-1 text-xs text-white/40">Zen bot refreshes quotes every 15 minutes.</p>
          <a
            href="https://quoteslate.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex text-[10px] text-coral"
          >
            Quotes powered by the QuoteSlate API
          </a>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus size={14} />
          Share moment
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-40 w-full" />
          ))}
        </div>
      ) : moments.length === 0 ? (
        <EmptyState title="No moments yet" subtitle="Share the first moment of calm." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {moments.map((moment) => (
            <ZenCard
              key={moment.id}
              moment={moment}
              canEdit={moment.authorUid === user.uid}
              onEdit={(item) => {
                setEditingMoment(item);
                setDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
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

      {snackbar && (
        <div className="fixed bottom-24 right-6 rounded-[2px] border border-white/10 bg-black/70 px-4 py-2 text-xs text-white/80">
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default ZenPage;
