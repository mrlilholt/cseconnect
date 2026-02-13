import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  IconButton,
  TextField,
  Stack
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth, provider } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { sanitizeEmail } from '../lib/allowlist';

const SignInPage = () => {
  const { status, deniedEmail, deniedReason } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [emailHint, setEmailHint] = useState('');

  useEffect(() => {
    if (status === 'allowed') {
      navigate('/');
    }
  }, [status, navigate]);

  const handleSignIn = async () => {
    setError('');
    try {
      if (emailHint) {
        provider.setCustomParameters({
          prompt: 'select_account',
          login_hint: emailHint.trim()
        });
      }
      const useRedirect = import.meta.env.VITE_USE_REDIRECT_AUTH === 'true';
      if (useRedirect) {
        await signInWithRedirect(auth, provider);
        return;
      }
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        try {
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectError) {
          setError(redirectError.message || 'Failed to sign in.');
          return;
        }
      }
      setError(err.message || 'Failed to sign in.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        background: 'radial-gradient(circle at top, #fff1ea 0%, #fff7f4 55%, #fffaf8 100%)'
      }}
    >
      <Card
        sx={{
          maxWidth: 520,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          boxShadow: '0 26px 60px rgba(255, 125, 110, 0.18)'
        }}
      >
        <Box sx={{ position: 'relative', height: 220 }}>
          <svg
            viewBox="0 0 520 220"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            style={{ position: 'absolute', inset: 0 }}
          >
            <defs>
              <linearGradient id="sunset" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFE2D6" />
                <stop offset="50%" stopColor="#FFB3A7" />
                <stop offset="100%" stopColor="#FF8A7A" />
              </linearGradient>
            </defs>
            <rect width="520" height="220" fill="url(#sunset)" />
            <circle cx="420" cy="40" r="110" fill="rgba(255, 255, 255, 0.35)" />
            <circle cx="90" cy="150" r="90" fill="rgba(255, 255, 255, 0.25)" />
            <path
              d="M0,150 C120,110 170,220 280,190 C380,165 430,120 520,140 L520,220 L0,220 Z"
              fill="rgba(255, 125, 110, 0.25)"
            />
          </svg>
        </Box>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, pt: 2 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                CS&E Connect
              </Typography>
              <Typography color="text.secondary">
                Sign in with your department account to join the conversation.
              </Typography>
            </Box>

            <TextField
              variant="standard"
              label="Department email"
              placeholder="you@baldwinschool.org"
              value={emailHint}
              onChange={(event) => setEmailHint(event.target.value)}
              fullWidth
              InputProps={{
                startAdornment: <MailOutlineIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                disableUnderline: false
              }}
              sx={{
                '& .MuiInput-root:before': {
                  borderBottom: '1px solid rgba(255, 173, 153, 0.6)'
                },
                '& .MuiInput-root:after': {
                  borderBottom: '2px solid rgba(255, 125, 110, 0.9)'
                }
              }}
            />

            {status === 'denied' && (
              <Alert severity="warning">
                {deniedEmail
                  ? `Access not granted for ${deniedEmail}. Ensure this email is in src/config/members.js and the Firestore allowlist collection.`
                  : 'Access not granted. Ensure your email is in src/config/members.js and the Firestore allowlist collection.'}
                {deniedReason && (
                  <Box sx={{ mt: 1, fontSize: '0.85rem' }}>Reason: {deniedReason}</Box>
                )}
                {deniedEmail && (
                  <Box sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                    Allowlist doc ID: {sanitizeEmail(deniedEmail)}
                  </Box>
                )}
              </Alert>
            )}
            {error && <Alert severity="error">{error}</Alert>}

            <Button
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={handleSignIn}
              fullWidth
              size="large"
              sx={{ py: 1.4, borderRadius: 999, boxShadow: '0 12px 24px rgba(255, 125, 110, 0.25)' }}
            >
              Sign in with Google
            </Button>

            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Other sign-in options
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <IconButton
                  sx={{
                    width: 44,
                    height: 44,
                    border: '1px solid rgba(255, 173, 153, 0.6)',
                    backgroundColor: '#fff'
                  }}
                  onClick={handleSignIn}
                >
                  <GoogleIcon />
                </IconButton>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignInPage;
