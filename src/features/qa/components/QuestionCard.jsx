import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  Box,
  Button,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ConfirmDialog from '../../../components/ConfirmDialog';
import AnswerDialog from './AnswerDialog';
import { addAnswer, deleteAnswer, subscribeToAnswers, updateAnswer } from '../api';
import { useAuth } from '../../../lib/auth';
import { formatDateTime } from '../../../lib/time';

const QuestionCard = ({ question, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [answers, setAnswers] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState(null);

  useEffect(() => {
    const unsub = subscribeToAnswers(question.id, setAnswers);
    return () => unsub();
  }, [question.id]);

  const handleAnswerSubmit = async ({ body }) => {
    if (editingAnswer) {
      await updateAnswer(question.id, editingAnswer.id, { body });
    } else {
      await addAnswer(question.id, {
        body,
        authorUid: user.uid,
        authorName: user.displayName || user.email
      });
    }
    setEditingAnswer(null);
    setAnswerDialogOpen(false);
  };

  const handleDeleteAnswer = async (answerId) => {
    await deleteAnswer(question.id, answerId);
  };

  return (
    <Card sx={{ mb: 2, borderRadius: 2, border: '1px solid rgba(255, 173, 153, 0.2)' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {question.title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {question.body}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
              {question.tags?.map((tag) => (
                <Chip key={tag} label={tag} size="small" />
              ))}
            </Stack>
          </Box>
          {question.authorUid === user.uid && (
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => onEdit(question)} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setConfirmOpen(true)} size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Answers ({answers.length})
          </Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={() => setAnswerDialogOpen(true)}>
            Add answer
          </Button>
        </Stack>
        <Stack spacing={1} sx={{ mt: 2 }}>
          {answers.length === 0 && (
            <Typography color="text.secondary">No answers yet. Be the first to respond.</Typography>
          )}
          {answers.map((answer) => (
            <Box
              key={answer.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
                p: 1.5,
                borderRadius: 20,
                backgroundColor: 'rgba(255, 173, 153, 0.12)'
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{answer.authorName || 'Member'}</Typography>
                <Typography>{answer.body}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDateTime(answer.createdAt)}
                </Typography>
              </Box>
              {answer.authorUid === user.uid && (
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingAnswer(answer);
                      setAnswerDialogOpen(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteAnswer(answer.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      </CardContent>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete question?"
        description="This will remove the question and all its answers."
        confirmLabel="Delete"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(question.id);
        }}
      />
      <AnswerDialog
        open={answerDialogOpen}
        onClose={() => {
          setAnswerDialogOpen(false);
          setEditingAnswer(null);
        }}
        onSubmit={handleAnswerSubmit}
        initialAnswer={editingAnswer}
      />
    </Card>
  );
};

export default QuestionCard;
