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

const zenCollection = collection(db, 'zenMoments');

const handleSnapshotError = (error, onError) => {
  if (onError) {
    onError(error);
  } else {
    console.error('zen moments subscription error', error);
  }
};

export const subscribeToZenMoments = (callback, onError) => {
  const q = query(zenCollection, orderBy('createdAt', 'desc'));
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

export const createZenMoment = async ({ text, user }) => {
  const payload = {
    text,
    authorUid: user.uid,
    authorName: user.displayName || user.email,
    createdAt: serverTimestamp()
  };
  return addDoc(zenCollection, payload);
};

export const updateZenMoment = async (momentId, updates) => {
  const ref = doc(db, 'zenMoments', momentId);
  return updateDoc(ref, { ...updates, updatedAt: serverTimestamp() });
};

export const deleteZenMoment = async (momentId) => {
  const ref = doc(db, 'zenMoments', momentId);
  return deleteDoc(ref);
};
