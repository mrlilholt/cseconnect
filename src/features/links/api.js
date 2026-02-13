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

export const subscribeToLinks = (callback, onError) => {
  const q = query(collection(db, 'links'), orderBy('createdAt', 'desc'));
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
        console.error('links subscription error', error);
      }
    }
  );
};

export const createLink = async (link) =>
  addDoc(collection(db, 'links'), {
    ...link,
    createdAt: serverTimestamp()
  });

export const updateLink = async (linkId, updates) =>
  updateDoc(doc(db, 'links', linkId), {
    ...updates,
    updatedAt: serverTimestamp()
  });

export const deleteLink = async (linkId) => deleteDoc(doc(db, 'links', linkId));
