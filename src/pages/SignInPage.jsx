import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { Mail } from 'lucide-react';
import { auth, provider } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { sanitizeEmail } from '../lib/allowlist';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';

const SignInPage = () => {
  const { status, deniedEmail, deniedReason } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [emailHint, setEmailHint] = useState('');
  const [inAppBrowser, setInAppBrowser] = useState(false);
  const [useRedirect, setUseRedirect] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === 'allowed') {
      navigate('/');
    }
  }, [status, navigate]);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    const isIosDevice = /iphone|ipad|ipod/i.test(ua);
    const isInApp =
      /FBAN|FBAV|Instagram|Line|LinkedInApp|Twitter|Snapchat|GSA|FB_IAB|wv|Messenger/i.test(ua);
    setInAppBrowser(isInApp);
    setIsIos(isIosDevice);
    const preferRedirect =
      import.meta.env.VITE_USE_REDIRECT_AUTH === 'true' || (isIosDevice && !isInApp);
    setUseRedirect(preferRedirect);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      setCopied(false);
    }
  };

  const handleSignIn = async () => {
    setError('');
    try {
      if (inAppBrowser) {
        setError('Open this page in Safari or Chrome to sign in.');
        return;
      }
      if (emailHint) {
        provider.setCustomParameters({
          prompt: 'select_account',
          login_hint: emailHint.trim()
        });
      }
      if (useRedirect) {
        await signInWithRedirect(auth, provider);
        return;
      }
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        try {
          if (inAppBrowser) {
            setError('Open this page in Safari or Chrome to sign in.');
            return;
          }
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
    <div className="min-h-screen cyber-bg flex items-center justify-center px-4">
      <div className="glass-card w-full max-w-lg rounded-[2px] border border-white/10 shadow-glow">
        <div className="relative overflow-hidden rounded-[2px] border-b border-white/10 bg-black/50 p-6">
          <div className="absolute inset-0 opacity-90">
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-coral/40 to-neonpink/40 blur-2xl animate-pulseGlow" />
            <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 animate-orbit" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 animate-orbitSlow" />
            <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10" />
          </div>
          <div className="relative">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="CS&E Connect"
                className="h-10 w-auto rounded-[2px] object-contain"
              />
              <span className="sr-only">CS&E Connect</span>
            </div>
            <p className="mt-2 text-sm text-holographic">
              Sign in with your department account to join the conversation.
            </p>
          </div>
        </div>

        <div className="p-6">
          {inAppBrowser ? (
            <div className="rounded-[2px] border border-white/10 bg-black/60 p-4">
              <p className="text-sm font-semibold text-gradient">Open in Safari</p>
              <p className="mt-2 text-xs text-white/60">
                Google sign-in does not work inside in-app browsers (Messages, Gmail, Instagram).
                Use the share icon and open this page in Safari or Chrome.
              </p>
              <div className="mt-3 space-y-2 text-xs text-white/50">
                <p>1. Tap the share icon in the top bar.</p>
                <p>2. Choose “Open in Safari”.</p>
                <p>3. Sign in with Google.</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  {copied ? 'Link copied' : 'Copy link'}
                </Button>
                <a
                  className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 hover:bg-white/5"
                  href={window.location.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in browser
                </a>
              </div>
            </div>
          ) : (
            <>
              <label className="text-xs uppercase tracking-[0.2em] text-white/40">Department email</label>
              <div className="mt-2 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-xl">
                <Mail size={16} className="text-white/50" />
                <input
                  className="w-full bg-transparent text-sm text-holographic placeholder:text-white/30 focus:outline-none"
                  placeholder="you@baldwinschool.org"
                  value={emailHint}
                  onChange={(event) => setEmailHint(event.target.value)}
                />
              </div>

              {status === 'denied' && (
                <Alert variant="warning" className="mt-4">
                  {deniedEmail
                    ? `Access not granted for ${deniedEmail}. Ensure this email is in src/config/members.js and the Firestore allowlist collection.`
                    : 'Access not granted. Ensure your email is in src/config/members.js and the Firestore allowlist collection.'}
                  {deniedReason && (
                    <div className="mt-2 text-xs text-white/60">Reason: {deniedReason}</div>
                  )}
                  {deniedEmail && (
                    <div className="mt-1 text-xs text-white/60">
                      Allowlist doc ID: {sanitizeEmail(deniedEmail)}
                    </div>
                  )}
                </Alert>
              )}

              {error && (
                <Alert variant="error" className="mt-4">
                  {error}
                </Alert>
              )}

              {isIos && useRedirect && (
                <Alert variant="info" className="mt-4">
                  You’re on iOS — we’ll use the secure redirect sign-in flow.
                </Alert>
              )}

              <Button className="mt-6 w-full" onClick={handleSignIn}>
                Sign in with Google
              </Button>
              <p className="mt-4 text-xs text-white/40">
                By signing in you agree to department access policies.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
