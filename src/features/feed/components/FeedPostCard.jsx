import React, { useEffect, useRef, useState } from 'react';
import {
  Heart,
  ThumbsUp,
  Sparkles,
  MessageCircle,
  Share2,
  Trash2,
  Edit3,
  Send
} from 'lucide-react';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { addComment, deleteComment, subscribeToComments, toggleReaction } from '../api';
import { useAuth } from '../../../lib/auth';
import { formatDateTime } from '../../../lib/time';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Avatar from '../../../components/ui/Avatar';
import Input from '../../../components/ui/Input';

const IconReactionButton = ({ icon: Icon, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 text-xs ${active ? 'text-coral' : 'text-white/50'} hover:text-coral`}
  >
    <Icon size={16} />
    {typeof count === 'number' && count > 0 && <span>{count}</span>}
  </button>
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
    <Card className="rounded-[2px]">
      <div className="flex items-start gap-4">
        <Avatar src={post.authorPhoto || ''} fallback={post.authorName?.[0] || 'U'} className="h-11 w-11" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">{post.authorName}</p>
              <p className="text-xs text-white/40">{formatDateTime(post.createdAt)}</p>
            </div>
            {isAuthor && (
              <div className="flex items-center gap-2 text-white/50">
                <button onClick={() => onEdit(post)}>
                  <Edit3 size={16} />
                </button>
                <button onClick={() => setConfirmOpen(true)} className="text-coral">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
          <p className="mt-3 text-sm text-white/80 whitespace-pre-wrap">{post.text}</p>
          {post.imageUrl && (
            <div className="mt-3 overflow-hidden rounded-[2px] border border-white/10 bg-black/60 shadow-glow">
              <img
                src={post.imageUrl}
                alt="Post"
                className="h-60 w-full object-contain"
              />
            </div>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <IconReactionButton
              icon={ThumbsUp}
              count={reactionCounts.like}
              active={userReaction === 'like'}
              onClick={() => handleReaction('like')}
            />
            <IconReactionButton
              icon={Heart}
              count={reactionCounts.love}
              active={userReaction === 'love'}
              onClick={() => handleReaction('love')}
            />
            <IconReactionButton
              icon={Sparkles}
              count={reactionCounts.celebrate}
              active={userReaction === 'celebrate'}
              onClick={() => handleReaction('celebrate')}
            />
            <button
              className="flex items-center gap-1 text-xs text-white/50 hover:text-coral"
              onClick={() => commentRef.current?.focus()}
            >
              <MessageCircle size={16} />
            </button>
            <button className="flex items-center gap-1 text-xs text-white/50 hover:text-coral" onClick={handleShare}>
              <Share2 size={16} />
            </button>
          </div>
          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-xs font-semibold text-white/70">Comments</p>
            <div className="mt-2 space-y-2">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start justify-between gap-2 rounded-[2px] bg-white/5 px-3 py-2">
                  <div>
                    <p className="text-xs font-semibold text-white/80">{comment.authorName}</p>
                    <p className="text-xs text-white/60">{comment.text}</p>
                  </div>
                  {comment.authorUid === user?.uid && (
                    <button className="text-white/40" onClick={() => handleDeleteComment(comment.id)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-xs text-white/40">Start the conversation.</p>
              )}
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Input
                className="rounded-[2px]"
                ref={commentRef}
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a comment"
              />
              <Button size="sm" onClick={handleCommentSubmit}>
                <Send size={14} />
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
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
