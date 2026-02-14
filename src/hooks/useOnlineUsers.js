import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DEFAULT_WINDOW_MS = 5 * 60 * 1000;
const RESUBSCRIBE_MS = 60 * 1000;

export const useOnlineUsers = (windowMs = DEFAULT_WINDOW_MS) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = null;

    const subscribe = () => {
      if (unsubscribe) unsubscribe();
      const since = Timestamp.fromDate(new Date(Date.now() - windowMs));
      const q = query(
        collection(db, 'users'),
        where('lastSeenAt', '>=', since),
        orderBy('lastSeenAt', 'desc')
      );

      unsubscribe = onSnapshot(
        q,
        (snap) => {
          setUsers(
            snap.docs.map((docSnap) => ({
              id: docSnap.id,
              ...docSnap.data()
            }))
          );
          setLoading(false);
        },
        (error) => {
          console.error('online users subscription error', error);
          setLoading(false);
        }
      );
    };

    subscribe();
    const interval = setInterval(subscribe, RESUBSCRIBE_MS);

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(interval);
    };
  }, [windowMs]);

  return { users, loading };
};
