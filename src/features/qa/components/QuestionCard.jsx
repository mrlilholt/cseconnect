import React, { useEffect, useState } from 'react';
import { Edit3, Trash2, Plus } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Chip from '../../../components/ui/Chip';
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
    <Card className="rounded-[2px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{question.title}</p>
          <p className="mt-2 text-xs text-white/60">{question.body}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {question.tags?.map((tag) => (
              <Chip key={tag} label={tag} />
            ))}
          </div>
        </div>
        {question.authorUid === user.uid && (
          <div className="flex items-center gap-2 text-white/50">
            <button onClick={() => onEdit(question)}>
              <Edit3 size={16} />
            </button>
            <button onClick={() => setConfirmOpen(true)} className="text-coral">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      <div className="my-4 h-px bg-white/10" />
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-white/70">Answers ({answers.length})</p>
        <button
          className="flex items-center gap-1 text-xs text-coral"
          onClick={() => setAnswerDialogOpen(true)}
        >
          <Plus size={14} /> Add answer
        </button>
      </div>
      <div className="mt-3 space-y-3">
        {answers.length === 0 && <p className="text-xs text-white/40">No answers yet.</p>}
        {answers.map((answer) => (
          <div key={answer.id} className="rounded-[2px] bg-white/5 px-3 py-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-white/80">{answer.authorName || 'Member'}</p>
                <p className="text-xs text-white/60">{answer.body}</p>
                <p className="text-[10px] text-white/40">{formatDateTime(answer.createdAt)}</p>
              </div>
              {answer.authorUid === user.uid && (
                <div className="flex items-center gap-2 text-white/50">
                  <button
                    onClick={() => {
                      setEditingAnswer(answer);
                      setAnswerDialogOpen(true);
                    }}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button className="text-coral" onClick={() => handleDeleteAnswer(answer.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
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
