import React, { useEffect, useState } from 'react';
import { Box, Button, Snackbar, Alert, Skeleton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../../lib/auth';
import { createQuestion, deleteQuestion, subscribeToQuestions, updateQuestion } from '../api';
import QuestionDialog from '../components/QuestionDialog';
import QuestionCard from '../components/QuestionCard';
import EmptyState from '../../../components/EmptyState';

const QaPage = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const unsub = subscribeToQuestions((items) => {
      setQuestions(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = async (payload) => {
    try {
      await createQuestion({ ...payload, authorUid: user.uid });
      setDialogOpen(false);
      showMessage('Question posted.');
    } catch (error) {
      showMessage(error.message || 'Unable to post question.', 'error');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateQuestion(editingQuestion.id, payload);
      setEditingQuestion(null);
      setDialogOpen(false);
      showMessage('Question updated.');
    } catch (error) {
      showMessage(error.message || 'Unable to update question.', 'error');
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      showMessage('Question deleted.');
    } catch (error) {
      showMessage(error.message || 'Unable to delete question.', 'error');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Q&A
          </Typography>
          <Typography color="text.secondary">Ask questions and share answers with the department.</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Ask a question
        </Button>
      </Box>

      {loading ? (
        [0, 1, 2].map((item) => <Skeleton key={item} height={200} sx={{ mb: 2 }} />)
      ) : questions.length === 0 ? (
        <EmptyState title="No questions yet" subtitle="Ask the first question to get started." />
      ) : (
        questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            onEdit={(item) => {
              setEditingQuestion(item);
              setDialogOpen(true);
            }}
            onDelete={handleDelete}
          />
        ))
      )}

      <QuestionDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingQuestion(null);
        }}
        onSubmit={editingQuestion ? handleUpdate : handleCreate}
        initialQuestion={editingQuestion}
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

export default QaPage;
