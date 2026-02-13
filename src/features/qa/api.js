import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const subscribeToQuestions = (callback, onError) => {
  const q = query(collection(db, 'questions'), orderBy('updatedAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      callback(
        snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
      );
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error('questions subscription error', error);
      }
    }
  );
};

export const createQuestion = async (question) =>
  addDoc(collection(db, 'questions'), {
    ...question,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

export const updateQuestion = async (questionId, updates) =>
  updateDoc(doc(db, 'questions', questionId), {
    ...updates,
    updatedAt: serverTimestamp()
  });

export const deleteQuestion = async (questionId) => deleteDoc(doc(db, 'questions', questionId));

export const subscribeToAnswers = (questionId, callback, onError) => {
  const q = query(
    collection(db, 'questions', questionId, 'answers'),
    orderBy('createdAt', 'asc')
  );
  return onSnapshot(
    q,
    (snap) => {
      callback(
        snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
      );
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error('answers subscription error', error);
      }
    }
  );
};

export const addAnswer = async (questionId, answer) =>
  addDoc(collection(db, 'questions', questionId, 'answers'), {
    ...answer,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

export const updateAnswer = async (questionId, answerId, updates) =>
  updateDoc(doc(db, 'questions', questionId, 'answers', answerId), {
    ...updates,
    updatedAt: serverTimestamp()
  });

export const deleteAnswer = async (questionId, answerId) =>
  deleteDoc(doc(db, 'questions', questionId, 'answers', answerId));
