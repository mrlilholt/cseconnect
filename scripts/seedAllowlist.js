import admin from 'firebase-admin';
import fs from 'node:fs';
import path from 'node:path';
import { members } from '../src/config/members.js';

const loadEnvFile = () => {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  return content.split('\n').reduce((acc, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return acc;
    const [key, ...rest] = trimmed.split('=');
    acc[key] = rest.join('=').trim();
    return acc;
  }, {});
};

const envFromFile = loadEnvFile();
const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  envFromFile.VITE_FIREBASE_PROJECT_ID;

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId
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
