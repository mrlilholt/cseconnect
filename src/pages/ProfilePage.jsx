import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Avatar,
  Stack,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { collection, onSnapshot, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { isValidE164 } from '../lib/validators';
import LoadingScreen from '../components/LoadingScreen';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [postsCount, setPostsCount] = useState(0);
  const [teammatesCount, setTeammatesCount] = useState(0);
  const [segment, setSegment] = useState('feeds');

  useEffect(() => {
    if (!user) return () => {};
    const ref = doc(db, 'users', user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setProfile(snap.data());
        setPhone(snap.data()?.phone || '');
        setDisplayName(snap.data()?.displayName || user?.displayName || '');
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return () => {};
    const postsQuery = query(collection(db, 'feedPosts'), where('authorUid', '==', user.uid));
    const usersQuery = query(collection(db, 'users'));

    const unsubPosts = onSnapshot(postsQuery, (snap) => {
      setPostsCount(snap.size);
    });
    const unsubUsers = onSnapshot(usersQuery, (snap) => {
      setTeammatesCount(snap.size);
    });

    return () => {
      unsubPosts();
      unsubUsers();
    };
  }, [user]);

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (phone && !isValidE164(phone)) {
      setError('Phone number must be in E.164 format, e.g., +15551234567.');
      return;
    }
    try {
      setSaving(true);
      const ref = doc(db, 'users', user.uid);
      await updateDoc(ref, {
        displayName: displayName.trim(),
        phone: phone || '',
        updatedAt: serverTimestamp()
      });
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName.trim()
        });
      }
      setSuccess('Profile updated.');
    } catch (err) {
      setError(err.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen label="Loading profile..." />;
  }

  return (
    <Box sx={{ maxWidth: 980 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Profile
      </Typography>

      <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              background: 'linear-gradient(135deg, #FFB3A7 0%, #FF7D6E 60%, #FF9A84 100%)',
              color: '#fff',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'auto 1fr auto' },
              alignItems: 'center',
              gap: 3
            }}
          >
            <Avatar
              src={user?.photoURL || ''}
              sx={{
                width: 96,
                height: 96,
                border: '4px solid rgba(255, 255, 255, 0.85)'
              }}
            >
              {user?.displayName?.[0] || user?.email?.[0] || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {user?.displayName || profile?.displayName || 'Department Member'}
              </Typography>
              <Typography sx={{ opacity: 0.9 }}>{user?.email}</Typography>
            </Box>
            <Stack direction={{ xs: 'row', md: 'column' }} spacing={2} sx={{ minWidth: 180 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                  Posts
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {postsCount}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                  Teammates
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {teammatesCount}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ p: { xs: 3, md: 4 }, backgroundColor: '#fff' }}>
            <ToggleButtonGroup
              value={segment}
              exclusive
              onChange={(_, value) => value && setSegment(value)}
              sx={{
                backgroundColor: 'rgba(255, 173, 153, 0.2)',
                p: 0.6,
                borderRadius: 999,
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: 999,
                  px: 3,
                  color: 'text.secondary'
                },
                '& .MuiToggleButton-root.Mui-selected': {
                  backgroundColor: '#FF7D6E',
                  color: '#fff'
                }
              }}
            >
              <ToggleButton value="feeds">Feeds</ToggleButton>
              <ToggleButton value="projects">Projects</ToggleButton>
              <ToggleButton value="links">Links</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Contact settings
          </Typography>
          <TextField
            label="Display name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="e.g., Ada Lovelace"
            fullWidth
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          />
          <TextField
            label="Phone number (for alerts)"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+15551234567"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Use E.164 format. This is required to receive SMS alerts.
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={handleSave}
            disabled={saving}
          >
            Save changes
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
