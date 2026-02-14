import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const zenCollection = collection(db, 'zenMoments');
const zenMetaDoc = doc(db, 'zenMeta', 'autoQuote');
const AUTO_INTERVAL_MS = 15 * 60 * 1000;
const DEFAULT_QUOTE_API = 'https://quoteslate.vercel.app/api/quotes/random';

const fallbackQuotes = [
  {
    text: 'Breathe in calm, breathe out what no longer serves.',
    author: 'Zen Archive'
  },
  {
    text: 'Small moments of stillness can reset an entire day.',
    author: 'Zen Archive'
  },
  {
    text: 'Let the next breath be a soft beginning.',
    author: 'Zen Archive'
  },
  {
    text: 'Peace arrives when we stop rushing it.',
    author: 'Zen Archive'
  }
];

const fetchZenQuote = async () => {
  const apiUrl =
    import.meta.env.VITE_ZEN_QUOTE_API_URL ||
    `${DEFAULT_QUOTE_API}?minLength=60&maxLength=140`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Quote API unavailable');
    }
    const payload = await response.json();
    const item = Array.isArray(payload) ? payload[0] : payload;
    if (!item || !item.quote) {
      throw new Error('Quote payload invalid');
    }
    return {
      text: item.quote.trim(),
      author: item.author || 'Unknown',
      sourceName: 'QuoteSlate',
      sourceUrl: 'https://quoteslate.vercel.app'
    };
  } catch (error) {
    const fallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    return {
      text: fallback.text,
      author: fallback.author,
      sourceName: 'Local',
      sourceUrl: ''
    };
  }
};

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

export const createZenMoment = async ({
  text,
  user,
  type = 'text',
  imageUrl = '',
  quoteAuthor = '',
  sourceName = '',
  sourceUrl = ''
}) => {
  const payload = {
    text,
    type,
    imageUrl,
    quoteAuthor,
    sourceName,
    sourceUrl,
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

export const createZenMomentWithPayload = async (payload) => addDoc(zenCollection, payload);

export const maybeSeedHourlyQuote = async () => {
  const metaSnap = await getDoc(zenMetaDoc);
  const now = Timestamp.now();
  if (metaSnap.exists()) {
    const last = metaSnap.data()?.lastGeneratedAt;
    if (last && now.toMillis() - last.toMillis() < AUTO_INTERVAL_MS) {
      return { skipped: true };
    }
  }

  const quote = await fetchZenQuote();

  return runTransaction(db, async (tx) => {
    const freshSnap = await tx.get(zenMetaDoc);
    const last = freshSnap.exists() ? freshSnap.data()?.lastGeneratedAt : null;
    if (last && now.toMillis() - last.toMillis() < AUTO_INTERVAL_MS) {
      return { skipped: true };
    }

    const momentRef = doc(collection(db, 'zenMoments'));
    tx.set(momentRef, {
      text: quote.text,
      type: 'quote',
      quoteAuthor: quote.author,
      authorUid: 'system',
      authorName: 'Zen Bot',
      isAuto: true,
      sourceName: quote.sourceName,
      sourceUrl: quote.sourceUrl,
      createdAt: now
    });

    tx.set(
      zenMetaDoc,
      {
        lastGeneratedAt: now,
        lastQuote: quote.text,
        lastAuthor: quote.author
      },
      { merge: true }
    );

    return { created: true };
  });
};
