import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  TextField,
  Typography,
  Button,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import CelebrationOutlinedIcon from '@mui/icons-material/CelebrationOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { addComment, deleteComment, subscribeToComments, toggleReaction } from '../api';
import { useAuth } from '../../../lib/auth';
import { formatDateTime } from '../../../lib/time';

const IconReactionButton = ({ icon, count, active, onClick }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    <IconButton
      size="small"
      onClick={onClick}
      sx={{
        color: active ? 'primary.main' : 'text.secondary',
        backgroundColor: active ? 'rgba(255, 173, 153, 0.2)' : 'transparent'
      }}
    >
      {icon}
    </IconButton>
    {typeof count === 'number' && count > 0 && (
      <Typography variant="caption" color="text.secondary">
        {count}
      </Typography>
    )}
  </Box>
);

const FeedPostCard = ({ post, onDelete, onEdit }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const commentRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeToComments(post.id, setComments);
    return () => unsub();
  }, [post.id]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    await addComment(post.id, { text: commentText.trim(), user });
    setCommentText('');
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(post.id, commentId);
  };

  const handleReaction = async (reaction) => {
    if (!user) return;
    await toggleReaction(post.id, reaction, user);
  };

  const isAuthor = user?.uid === post.authorUid;
  const reactionCounts = post.reactionCounts || {};
  const userReaction = post.reactionsBy?.[user?.uid] || '';

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(post.text || 'CS&E Connect post');
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        border: '1px solid rgba(255, 173, 153, 0.2)',
        boxShadow: '0 18px 45px rgba(255, 125, 110, 0.15)'
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              p: 0.4,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,173,153,0.9), rgba(255,125,110,0.85))'
            }}
          >
            <Avatar src={post.authorPhoto || ''} sx={{ width: 48, height: 48 }}>
              {post.authorName?.[0] || 'U'}
            </Avatar>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {post.authorName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDateTime(post.createdAt)}
                </Typography>
              </Box>
              {isAuthor && (
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => onEdit(post)} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => setConfirmOpen(true)} size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              )}
            </Stack>
            <Typography sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>{post.text}</Typography>
            {post.imageUrl && (
              <Box
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 173, 153, 0.25)',
                  maxHeight: { xs: 240, sm: 280, md: 320 },
                  backgroundColor: '#fff'
                }}
              >
                <Box
                  component="img"
                  src={post.imageUrl}
                  alt="Post"
                  sx={{
                    width: '100%',
                    height: '100%',
                    maxHeight: { xs: 240, sm: 280, md: 320 },
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </Box>
            )}
            <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <IconReactionButton
                icon={<ThumbUpAltOutlinedIcon fontSize="small" />}
                count={reactionCounts.like}
                active={userReaction === 'like'}
                onClick={() => handleReaction('like')}
              />
              <IconReactionButton
                icon={<FavoriteBorderIcon fontSize="small" />}
                count={reactionCounts.love}
                active={userReaction === 'love'}
                onClick={() => handleReaction('love')}
              />
              <IconReactionButton
                icon={<CelebrationOutlinedIcon fontSize="small" />}
                count={reactionCounts.celebrate}
                active={userReaction === 'celebrate'}
                onClick={() => handleReaction('celebrate')}
              />
              <IconReactionButton
                icon={<ChatBubbleOutlineIcon fontSize="small" />}
                onClick={() => commentRef.current?.focus()}
              />
              <IconReactionButton icon={<ShareOutlinedIcon fontSize="small" />} onClick={handleShare} />
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Comments
            </Typography>
            <Stack spacing={1}>
              {comments.map((comment) => (
                <Box
                  key={comment.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 1.5,
                    borderRadius: 20,
                    backgroundColor: 'rgba(255, 173, 153, 0.12)'
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {comment.authorName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {comment.text}
                    </Typography>
                  </Box>
                  {comment.authorUid === user?.uid && (
                    <IconButton size="small" onClick={() => handleDeleteComment(comment.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
              {comments.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Start the conversation.
                </Typography>
              )}
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
              <TextField
                inputRef={commentRef}
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a comment"
                size="small"
                fullWidth
              />
              <Button variant="contained" onClick={handleCommentSubmit} endIcon={<SendIcon />}>
                Comment
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete post?"
        description="This will permanently remove the post and its comments."
        confirmLabel="Delete"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(post.id);
        }}
      />
    </Card>
  );
};

export default FeedPostCard;
