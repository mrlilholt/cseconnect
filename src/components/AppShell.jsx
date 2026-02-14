import React, { useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { Menu } from 'lucide-react';
import NavDrawer from './NavDrawer';
import { auth } from '../lib/firebase';
import { useAuth } from '../lib/auth';
import Avatar from './ui/Avatar';
import IconButton from './ui/IconButton';

const AppShell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = useMemo(() => {
    if (!user) return 'CS';
    if (user.displayName) {
      return user.displayName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    }
    return user.email ? user.email[0].toUpperCase() : 'CS';
  }, [user]);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen cyber-bg text-holographic">
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="md:ml-64">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            <div className="flex items-center gap-3">
              <IconButton className="md:hidden" onClick={() => setDrawerOpen(true)}>
                <Menu size={18} />
              </IconButton>
              <img
                src="/logo.png"
                alt="CS&E Connect"
                className="h-8 w-auto rounded-[2px] object-contain"
              />
              <span className="sr-only">CS&E Connect</span>
            </div>
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-2 py-1"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <Avatar src={user?.photoURL || ''} fallback={initials} />
                <span className="hidden text-sm text-white/70 sm:block">{user?.displayName || 'Member'}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-[2px] border border-white/10 bg-black/80 p-2 shadow-glow">
                  <button
                    className="w-full rounded-[2px] px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate('/profile');
                    }}
                  >
                    Profile & Settings
                  </button>
                  <button
                    className="mt-1 w-full rounded-[2px] px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5"
                    onClick={() => {
                      setMenuOpen(false);
                      handleSignOut();
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
