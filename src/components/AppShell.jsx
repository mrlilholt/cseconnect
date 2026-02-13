import React, { useEffect, useMemo, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import NavDrawer, { drawerWidth } from './NavDrawer';
import { auth } from '../lib/firebase';
import { useAuth } from '../lib/auth';

const AppShell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const drawerVariant = isMobile ? 'temporary' : 'permanent';

  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: 'text.primary',
          borderBottom: '1px solid rgba(255, 173, 153, 0.35)',
          backdropFilter: 'blur(8px)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            CS&E Connect
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton onClick={handleMenuOpen}>
            <Avatar
              src={user?.photoURL || ''}
              alt={user?.displayName || 'User'}
              sx={{
                width: 42,
                height: 42,
                border: '2px solid rgba(255, 173, 153, 0.6)'
              }}
            >
              {initials}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate('/profile');
              }}
            >
              Profile & Settings
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleSignOut();
              }}
            >
              Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <NavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant={drawerVariant}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          mt: 10
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppShell;
