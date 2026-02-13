import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const subscribeToChannels = (callback, onError) => {
  const q = query(collection(db, 'chatChannels'), orderBy('createdAt', 'asc'));
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
        console.error('channels subscription error', error);
      }
    }
  );
};

export const createChannel = async (name) =>
  addDoc(collection(db, 'chatChannels'), {
    name,
    createdAt: serverTimestamp()
  });

export const subscribeToMessages = (channelId, callback, onError) => {
  const q = query(
    collection(db, 'chatChannels', channelId, 'messages'),
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
        console.error('messages subscription error', error);
      }
    }
  );
};

export const sendMessage = async (channelId, message) =>
  addDoc(collection(db, 'chatChannels', channelId, 'messages'), {
    ...message,
    createdAt: serverTimestamp()
  });
