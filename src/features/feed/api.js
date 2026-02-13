import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const subscribeToFeedPosts = (callback, onError) => {
  const q = query(collection(db, 'feedPosts'), orderBy('createdAt', 'desc'));
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
        console.error('feedPosts subscription error', error);
      }
    }
  );
};

export const createFeedPost = async ({ text, imageUrl, user }) => {
  const payload = {
    authorUid: user.uid,
    authorName: user.displayName || user.email,
    authorPhoto: user.photoURL || '',
    text,
    imageUrl: imageUrl || '',
    reactionCounts: {
      like: 0,
      love: 0,
      celebrate: 0
    },
    reactionsBy: {},
    createdAt: serverTimestamp()
  };
  return addDoc(collection(db, 'feedPosts'), payload);
};

export const updateFeedPost = async (postId, updates) => {
  const refDoc = doc(db, 'feedPosts', postId);
  return updateDoc(refDoc, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteFeedPost = async (postId) => deleteDoc(doc(db, 'feedPosts', postId));

export const subscribeToComments = (postId, callback, onError) => {
  const q = query(
    collection(db, 'feedPosts', postId, 'comments'),
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
        console.error('comments subscription error', error);
      }
    }
  );
};

export const addComment = async (postId, { text, user }) => {
  const payload = {
    authorUid: user.uid,
    authorName: user.displayName || user.email,
    text,
    createdAt: serverTimestamp()
  };
  return addDoc(collection(db, 'feedPosts', postId, 'comments'), payload);
};

export const deleteComment = async (postId, commentId) =>
  deleteDoc(doc(db, 'feedPosts', postId, 'comments', commentId));

export const toggleReaction = async (postId, reaction, user) => {
  const ref = doc(db, 'feedPosts', postId);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) {
      throw new Error('Post not found');
    }
    const data = snap.data();
    const reactionCounts = {
      like: 0,
      love: 0,
      celebrate: 0,
      ...(data.reactionCounts || {})
    };
    const reactionsBy = { ...(data.reactionsBy || {}) };
    const current = reactionsBy[user.uid];

    if (current === reaction) {
      reactionCounts[reaction] = Math.max(0, (reactionCounts[reaction] || 0) - 1);
      delete reactionsBy[user.uid];
    } else {
      if (current) {
        reactionCounts[current] = Math.max(0, (reactionCounts[current] || 0) - 1);
      }
      reactionCounts[reaction] = (reactionCounts[reaction] || 0) + 1;
      reactionsBy[user.uid] = reaction;
    }

    tx.update(ref, {
      reactionCounts,
      reactionsBy,
      updatedAt: serverTimestamp()
    });
  });
};
