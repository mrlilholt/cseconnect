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

const tubesCollection = collection(db, 'tubes');

const handleSnapshotError = (error, onError) => {
  if (onError) {
    onError(error);
  } else {
    console.error('tubes subscription error', error);
  }
};

export const subscribeToTubes = (callback, onError) => {
  const q = query(tubesCollection, orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      callback(
        snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }))
      );
    },
    (error) => handleSnapshotError(error, onError)
  );
};

export const createTube = async ({ title, url, description, tags, user }) => {
  const payload = {
    title,
    url,
    description: description || '',
    tags: tags || [],
    authorUid: user.uid,
    authorName: user.displayName || user.email,
    createdAt: serverTimestamp()
  };
  return addDoc(tubesCollection, payload);
};

export const updateTube = async (tubeId, updates) => {
  const ref = doc(db, 'tubes', tubeId);
  return updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
};

export const deleteTube = async (tubeId) => {
  const ref = doc(db, 'tubes', tubeId);
  return deleteDoc(ref);
};
