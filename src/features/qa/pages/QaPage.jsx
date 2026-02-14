import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { createQuestion, deleteQuestion, subscribeToQuestions, updateQuestion } from '../api';
import QuestionDialog from '../components/QuestionDialog';
import QuestionCard from '../components/QuestionCard';
import EmptyState from '../../../components/EmptyState';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';

const QaPage = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    const unsub = subscribeToQuestions((items) => {
      setQuestions(items);
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
      await createQuestion({ ...payload, authorUid: user.uid });
      setDialogOpen(false);
      showMessage('Question posted.');
    } catch (error) {
      showMessage(error.message || 'Unable to post question.');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateQuestion(editingQuestion.id, payload);
      setEditingQuestion(null);
      setDialogOpen(false);
      showMessage('Question updated.');
    } catch (error) {
      showMessage(error.message || 'Unable to update question.');
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      showMessage('Question deleted.');
    } catch (error) {
      showMessage(error.message || 'Unable to delete question.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gradient">Q&A</h2>
          <p className="text-sm text-white/50">Ask questions and share answers with the department.</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus size={14} />
          Ask a question
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-44 w-full" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <EmptyState title="No questions yet" subtitle="Ask the first question to get started." />
      ) : (
        <div className="space-y-3">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onEdit={(item) => {
                setEditingQuestion(item);
                setDialogOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
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

      {snackbar && (
        <div className="fixed bottom-24 right-6 rounded-[2px] border border-white/10 bg-black/70 px-4 py-2 text-xs text-white/80">
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default QaPage;
