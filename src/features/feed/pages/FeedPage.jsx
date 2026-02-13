import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Skeleton,
  Typography,
  Fab,
  Paper,
  IconButton,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import ChatIcon from '@mui/icons-material/Chat';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/auth';
import { createFeedPost, deleteFeedPost, subscribeToFeedPosts, updateFeedPost } from '../api';
import FeedPostCard from '../components/FeedPostCard';
import NewPostDialog from '../components/NewPostDialog';
import EmptyState from '../../../components/EmptyState';
import { drawerWidth } from '../../../components/NavDrawer';

const FeedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const unsub = subscribeToFeedPosts((items) => {
      setPosts(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
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
    <Box sx={{ pb: 14 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Department Feed
          </Typography>
          <Typography color="text.secondary">Catch up on quick updates from the team.</Typography>
        </Box>
        {!isMobile && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New post
          </Button>
        )}
      </Box>

      {loading ? (
        [0, 1, 2].map((item) => <Skeleton key={item} height={220} sx={{ mb: 2 }} />)
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

      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          left: { xs: 16, md: drawerWidth + 16 },
          right: { xs: 16, md: 24 },
          bottom: 24,
          height: 68,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          borderRadius: 999,
          border: '1px solid rgba(255, 173, 153, 0.45)',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 16px 40px rgba(255, 125, 110, 0.18)'
        }}
      >
        <IconButton
          onClick={() => navigate('/feed')}
          sx={{
            color: navActive('/feed') ? 'primary.main' : 'text.secondary',
            backgroundColor: navActive('/feed') ? 'rgba(255, 173, 153, 0.2)' : 'transparent'
          }}
        >
          <DynamicFeedIcon />
        </IconButton>
        <Fab
          color="primary"
          onClick={openCreate}
          sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
        >
          <AddIcon />
        </Fab>
        <IconButton
          onClick={() => navigate('/messages')}
          sx={{
            color: navActive('/messages') ? 'primary.main' : 'text.secondary',
            backgroundColor: navActive('/messages') ? 'rgba(255, 173, 153, 0.2)' : 'transparent'
          }}
        >
          <ChatIcon />
        </IconButton>
      </Paper>

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

export default FeedPage;
