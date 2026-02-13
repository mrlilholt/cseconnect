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

export const subscribeToProjects = (callback, onError) => {
  const q = query(collection(db, 'projects'), orderBy('updatedAt', 'desc'));
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
        console.error('projects subscription error', error);
      }
    }
  );
};

export const createProject = async (project) =>
  addDoc(collection(db, 'projects'), {
    ...project,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

export const updateProject = async (projectId, updates) =>
  updateDoc(doc(db, 'projects', projectId), {
    ...updates,
    updatedAt: serverTimestamp()
  });

export const deleteProject = async (projectId) => deleteDoc(doc(db, 'projects', projectId));
