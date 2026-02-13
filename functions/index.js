const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const twilio = require('twilio');

admin.initializeApp();
const db = admin.firestore();

function sanitizeEmail(email) {
  return String(email || '').trim().toLowerCase().replace(/\./g, ',');
}

async function isAllowedEmail(email) {
  if (!email) return false;
  const docId = sanitizeEmail(email);
  const snap = await db.collection('allowlist').doc(docId).get();
  return snap.exists;
}

exports.sendBroadcastSms = onCall(async (request) => {
  const auth = request.auth;
  if (!auth || !auth.token || !auth.token.email) {
    throw new HttpsError('unauthenticated', 'Sign-in required.');
  }

  const allowed = await isAllowedEmail(auth.token.email);
  if (!allowed) {
    throw new HttpsError('permission-denied', 'Access not granted.');
  }

  const alertId = request.data && request.data.alertId;
  if (!alertId) {
    throw new HttpsError('invalid-argument', 'alertId is required.');
  }

  const alertRef = db.collection('alerts').doc(alertId);
  const alertSnap = await alertRef.get();
  if (!alertSnap.exists) {
    throw new HttpsError('not-found', 'Alert not found.');
  }

  const alertData = alertSnap.data();
  const message = alertData.message || 'CS&E Alert';

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    await alertRef.set(
      {
        smsStatus: 'skipped',
        smsError: 'SMS not configured'
      },
      { merge: true }
    );
    return { configured: false };
  }

  const client = twilio(accountSid, authToken);

  const usersSnap = await db.collection('users').get();
  const phoneNumbers = [];
  usersSnap.forEach((doc) => {
    const data = doc.data();
    if (data && data.phone) {
      phoneNumbers.push(data.phone);
    }
  });

  if (phoneNumbers.length === 0) {
    await alertRef.set(
      {
        smsStatus: 'skipped',
        smsError: 'No phone numbers on file'
      },
      { merge: true }
    );
    return { configured: true, sent: 0, failed: 0 };
  }

  const results = await Promise.allSettled(
    phoneNumbers.map((to) =>
      client.messages.create({
        to,
        from: fromNumber,
        body: message
      })
    )
  );

  const failed = results.filter((result) => result.status === 'rejected');
  const sent = results.length - failed.length;

  if (failed.length > 0) {
    const firstError = failed[0].reason ? String(failed[0].reason.message || failed[0].reason) : 'Unknown error';
    await alertRef.set(
      {
        smsStatus: 'failed',
        smsError: firstError
      },
      { merge: true }
    );
  } else {
    await alertRef.set(
      {
        smsStatus: 'sent',
        smsError: admin.firestore.FieldValue.delete()
      },
      { merge: true }
    );
  }

  return { configured: true, sent, failed: failed.length };
});
