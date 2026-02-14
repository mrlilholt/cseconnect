import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { getMemberDisplayName, isAllowedLocal, normalizeEmail, sanitizeEmail } from './allowlist';

const AuthContext = createContext({
  user: null,
  status: 'loading',
  deniedEmail: '',
  deniedReason: ''
});

const ensureUserDocument = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  const existing = await getDoc(userRef);
  const payload = {
    uid: user.uid,
    email: normalizeEmail(user.email),
    displayName: user.displayName || getMemberDisplayName(user.email) || 'Member',
    photoURL: user.photoURL || '',
    lastSeenAt: serverTimestamp()
  };
  if (!existing.exists()) {
    payload.createdAt = serverTimestamp();
  }
  await setDoc(userRef, payload, { merge: true });
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [deniedEmail, setDeniedEmail] = useState('');
  const [deniedReason, setDeniedReason] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setStatus(deniedEmail ? 'denied' : 'signedOut');
        return;
      }

      const email = normalizeEmail(nextUser.email);
      if (!email || !isAllowedLocal(email)) {
        setDeniedEmail(email);
        setDeniedReason('local');
        setStatus('denied');
        await signOut(auth);
        return;
      }

      try {
        await nextUser.getIdToken();
        const allowRef = doc(db, 'allowlist', sanitizeEmail(email));
        const rawRef = doc(db, 'allowlist', email);
        const [allowSnap, rawSnap] = await Promise.all([getDoc(allowRef), getDoc(rawRef)]);
        if (!allowSnap.exists() && !rawSnap.exists()) {
          setDeniedEmail(email);
          setDeniedReason('firestore-missing');
          setStatus('denied');
          await signOut(auth);
          return;
        }
      } catch (error) {
        if (error?.code !== 'permission-denied') {
          setDeniedEmail(email);
          setDeniedReason(error?.code || 'firestore-error');
          setStatus('denied');
          await signOut(auth);
          return;
        }
        // If we can't read allowlist due to rules, rely on Firestore rules enforcement.
      }

      setUser(nextUser);
      setStatus('allowed');
      setDeniedEmail('');
      setDeniedReason('');

      try {
        await ensureUserDocument(nextUser);
      } catch (error) {
        // Ignore non-blocking errors
      }
    });

    return () => unsubscribe();
  }, [deniedEmail]);

  useEffect(() => {
    if (!user) return () => {};
    const ref = doc(db, 'users', user.uid);
    const updateLastSeen = async () => {
      try {
        await updateDoc(ref, { lastSeenAt: serverTimestamp() });
      } catch (error) {
        // Ignore non-blocking errors
      }
    };

    updateLastSeen();
    const interval = setInterval(updateLastSeen, 60 * 1000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        updateLastSeen();
      }
    };

    window.addEventListener('focus', updateLastSeen);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', updateLastSeen);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      status,
      deniedEmail,
      deniedReason
    }),
    [user, status, deniedEmail, deniedReason]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
