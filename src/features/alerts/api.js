import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../../lib/firebase';

export const subscribeToAlerts = (callback, onError) => {
  const q = query(collection(db, 'alerts'), orderBy('createdAt', 'desc'));
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
        console.error('alerts subscription error', error);
      }
    }
  );
};

export const createAlert = async ({ message, user }) =>
  addDoc(collection(db, 'alerts'), {
    authorUid: user.uid,
    message,
    createdAt: serverTimestamp()
  });

export const updateAlertStatus = async (alertId, data) =>
  updateDoc(doc(db, 'alerts', alertId), data);

export const sendBroadcastSms = async (alertId) => {
  const callable = httpsCallable(functions, 'sendBroadcastSms');
  return callable({ alertId });
};
