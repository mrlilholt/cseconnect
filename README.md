# CS&E Connect

Internal collaboration hub for the Computer Science & Engineering department.

## Stack
- React + Vite (JavaScript)
- Material UI (MUI)
- Firebase Auth (Google OAuth), Firestore
- Firebase Functions (optional SMS broadcast via Twilio)
- PWA with offline shell caching

## Quick start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Firebase project at https://console.firebase.google.com.
3. Enable **Authentication > Google** sign-in.
4. Create **Firestore** in production or test mode.
6. Copy `.env.example` to `.env` and fill in values from Firebase project settings.
   - If you see popup/COOP warnings, set `VITE_USE_REDIRECT_AUTH=true` to use redirect auth.
7. Update the allowlist in `src/config/members.js`.
8. Seed the allowlist collection (required for security rules) using the script below.
9. Run the app:
   ```bash
   npm run dev
   ```

## Allowlist setup
Allowlist enforcement happens in two places:
- Local config: `src/config/members.js`
- Firestore collection: `allowlist/{emailDocId}`

Allowlist entries are created in two forms:
- Sanitized doc ID by replacing `.` with `,` and lowercasing (e.g., `faculty@example.edu` → `faculty@example,edu`).
- Raw doc ID using the exact email string.

### Seed allowlist collection
The script uses Firebase Admin credentials:
```bash
export GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/serviceAccountKey.json
node scripts/seedAllowlist.js
```

## Firebase rules
Rules live in:
- `firestore.rules`
- `storage.rules` (only needed if you later enable Firebase Storage)

They require:
- authenticated user
- user email exists in `allowlist` collection

Deploy rules:
```bash
firebase deploy --only firestore:rules,storage:rules
```

## Optional: SMS alerts (Twilio)
Alerts always log to Firestore. SMS is optional.

### Local emulator
1. Install functions dependencies:
   ```bash
   cd functions && npm install
   ```
2. Create `functions/.env` with:
   ```
   TWILIO_ACCOUNT_SID=...
   TWILIO_AUTH_TOKEN=...
   TWILIO_FROM_NUMBER=+15551234567
   ```
3. Start emulators:
   ```bash
   firebase emulators:start --only functions
   ```
4. Set `VITE_USE_FUNCTIONS_EMULATOR=true` in `.env`.

### Production
Set environment variables for Cloud Functions:
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_FROM_NUMBER`

Then deploy:
```bash
firebase deploy --only functions
```

If these variables are missing, the Alerts page still works and will display “SMS not configured.”

## Feed images (no Storage)
The feed supports optional image URLs. Images are referenced by external URL so you can keep Firebase Storage disabled and free.

## PWA
The app is installable on iOS/Android. The offline shell is cached via Workbox (see `vite.config.js`).

## Project structure
```
src/
  components/
  config/
  features/
    feed/
    projects/
    qa/
    links/
    chat/
    alerts/
  lib/
  pages/
```

## Development tips
- Use the Firebase console to verify `users`, `feedPosts`, `projects`, `questions`, `links`, `chatChannels`, and `alerts` collections.
- Keep member emails in `src/config/members.js` in sync with the Firestore allowlist.

## Deploy (optional)
```bash
npm run build
firebase deploy --only hosting
```
