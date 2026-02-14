import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import { isValidE164 } from '../lib/validators';
import LoadingScreen from '../components/LoadingScreen';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';

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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gradient">Profile</h2>

      <Card className="rounded-[2px] p-0">
        <div className="grid gap-6 border-b border-white/10 bg-gradient-to-br from-coral/30 to-neonpink/30 p-6 md:grid-cols-[auto_1fr_auto]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-black/40 text-xl font-semibold text-white">
            {user?.displayName?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div>
            <p className="text-lg font-semibold text-white">{user?.displayName || profile?.displayName}</p>
            <p className="text-xs text-white/60">{user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-white/70">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40">Posts</p>
              <p className="text-lg font-semibold text-white">{postsCount}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-white/40">Teammates</p>
              <p className="text-lg font-semibold text-white">{teammatesCount}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 p-4">
          {['feeds', 'projects', 'links'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSegment(tab)}
              className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-widest ${
                segment === tab ? 'bg-gradient-to-r from-coral to-neonpink text-white shadow-glow' : 'border border-white/10 text-white/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </Card>

      <Card className="rounded-[2px]">
        <h3 className="text-sm font-semibold text-gradient">Contact settings</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-white/40">Display name</label>
            <Input
              className="mt-2 rounded-[2px]"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="e.g., Ada Lovelace"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-white/40">Phone number (for alerts)</label>
            <Input
              className="mt-2 rounded-[2px]"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+15551234567"
            />
            <p className="mt-1 text-xs text-white/40">Use E.164 format. This is required to receive SMS alerts.</p>
          </div>
          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Button className="w-fit" onClick={handleSave} disabled={saving}>
            Save changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
