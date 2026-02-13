import admin from 'firebase-admin';
import { members } from '../src/config/members.js';

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

const sanitizeEmail = (email) => String(email || '').trim().toLowerCase().replace(/\./g, ',');

const emails = members
  .map((member) => (typeof member === 'string' ? member : member.email))
  .filter(Boolean)
  .map((email) => email.trim().toLowerCase());

if (emails.length === 0) {
  console.error('No members found in src/config/members.js');
  process.exit(1);
}

const batch = db.batch();

emails.forEach((email) => {
  const sanitizedId = sanitizeEmail(email);
  const sanitizedRef = db.collection('allowlist').doc(sanitizedId);
  batch.set(sanitizedRef, { email, key: 'sanitized' }, { merge: true });

  const rawRef = db.collection('allowlist').doc(email);
  batch.set(rawRef, { email, key: 'raw' }, { merge: true });
});

await batch.commit();
console.log(`Seeded ${emails.length} allowlist entries.`);
