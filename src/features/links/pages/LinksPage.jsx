import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { createLink, deleteLink, subscribeToLinks, updateLink } from '../api';
import LinkDialog from '../components/LinkDialog';
import LinkCard from '../components/LinkCard';
import EmptyState from '../../../components/EmptyState';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';

const LinksPage = () => {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    const unsub = subscribeToLinks((items) => {
      setLinks(items);
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
      await createLink({ ...payload, authorUid: user.uid });
      setDialogOpen(false);
      showMessage('Link saved.');
    } catch (error) {
      showMessage(error.message || 'Unable to save link.');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateLink(editingLink.id, payload);
      setEditingLink(null);
      setDialogOpen(false);
      showMessage('Link updated.');
    } catch (error) {
      showMessage(error.message || 'Unable to update link.');
    }
  };

  const handleDelete = async (linkId) => {
    try {
      await deleteLink(linkId);
      showMessage('Link deleted.');
    } catch (error) {
      showMessage(error.message || 'Unable to delete link.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gradient">Saved Links</h2>
          <p className="text-sm text-white/50">Curate articles and videos for the team.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus size={14} />
          Save link
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-40 w-full" />
          ))}
        </div>
      ) : links.length === 0 ? (
        <EmptyState title="No links yet" subtitle="Save an article or video for the team." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((linkItem) => (
            <LinkCard
              key={linkItem.id}
              linkItem={linkItem}
              canEdit={linkItem.authorUid === user.uid}
              onEdit={(item) => {
                setEditingLink(item);
                setDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
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

      {snackbar && (
        <div className="fixed bottom-24 right-6 rounded-[2px] border border-white/10 bg-black/70 px-4 py-2 text-xs text-white/80">
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default LinksPage;
