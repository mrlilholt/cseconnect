import React, { useEffect, useState } from 'react';
import { Plus, Rss, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/auth';
import { createFeedPost, deleteFeedPost, subscribeToFeedPosts, updateFeedPost } from '../api';
import FeedPostCard from '../components/FeedPostCard';
import NewPostDialog from '../components/NewPostDialog';
import EmptyState from '../../../components/EmptyState';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Skeleton from '../../../components/ui/Skeleton';

const FeedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    const unsub = subscribeToFeedPosts((items) => {
      setPosts(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ message, severity });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const handleCreate = async ({ text, imageUrl }) => {
    try {
      await createFeedPost({ text, imageUrl, user });
      setDialogOpen(false);
      showMessage('Post published.');
    } catch (error) {
      showMessage(error.message || 'Unable to create post.', 'error');
    }
  };

  const handleUpdate = async ({ text, imageUrl }) => {
    try {
      await updateFeedPost(editingPost.id, { text, imageUrl });
      setEditingPost(null);
      setDialogOpen(false);
      showMessage('Post updated.');
    } catch (error) {
      showMessage(error.message || 'Unable to update post.', 'error');
    }
  };

  const handleDelete = async (postId) => {
    try {
      await deleteFeedPost(postId);
      showMessage('Post deleted.');
    } catch (error) {
      showMessage(error.message || 'Unable to delete post.', 'error');
    }
  };

  const openCreate = () => {
    setEditingPost(null);
    setDialogOpen(true);
  };

  const openEdit = (post) => {
    setEditingPost(post);
    setDialogOpen(true);
  };

  const navActive = (path) => location.pathname === path;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gradient">Department Feed</h2>
          <p className="text-sm text-white/50">Catch up on quick updates from the team.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} />
          New post
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-48 w-full" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState title="No posts yet" subtitle="Share the first update with the department." />
      ) : (
        posts.map((post) => (
          <FeedPostCard key={post.id} post={post} onDelete={handleDelete} onEdit={openEdit} />
        ))
      )}

      <NewPostDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={editingPost ? handleUpdate : handleCreate}
        initialPost={editingPost}
      />

      <Card className="fixed bottom-6 left-1/2 z-20 flex w-[90%] max-w-lg -translate-x-1/2 items-center justify-between px-6 py-3 rounded-full">
        <button
          className={`flex h-10 w-10 items-center justify-center rounded-full ${navActive('/feed') ? 'bg-white/10 text-coral' : 'text-white/60'}`}
          onClick={() => navigate('/feed')}
        >
          <Rss size={18} />
        </button>
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-coral to-neonpink shadow-glow"
          onClick={openCreate}
        >
          <Plus size={20} />
        </button>
        <button
          className={`flex h-10 w-10 items-center justify-center rounded-full ${navActive('/messages') ? 'bg-white/10 text-coral' : 'text-white/60'}`}
          onClick={() => navigate('/messages')}
        >
          <MessageCircle size={18} />
        </button>
      </Card>

      {snackbar && (
        <div className="fixed bottom-24 right-6 rounded-[2px] border border-white/10 bg-black/70 px-4 py-2 text-xs text-white/80">
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default FeedPage;
