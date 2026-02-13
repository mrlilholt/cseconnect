import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LinkIcon from '@mui/icons-material/Link';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ChatIcon from '@mui/icons-material/Chat';
import CampaignIcon from '@mui/icons-material/Campaign';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SpaIcon from '@mui/icons-material/Spa';

const drawerWidth = 260;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, to: '/' },
  { label: 'Feed', icon: <DynamicFeedIcon />, to: '/feed' },
  { label: 'Projects', icon: <WorkspacesIcon />, to: '/projects' },
  { label: 'Q&A', icon: <QuestionAnswerIcon />, to: '/qa' },
  { label: 'Links', icon: <LinkIcon />, to: '/links' },
  { label: 'Tubes', icon: <YouTubeIcon />, to: '/tubes' },
  { label: 'Moments of ZEN', icon: <SpaIcon />, to: '/zen' },
  { label: 'Messages', icon: <ChatIcon />, to: '/messages' },
  { label: 'Alerts', icon: <CampaignIcon />, to: '/alerts' },
  { label: 'Profile', icon: <AccountCircleIcon />, to: '/profile' }
];

const NavDrawer = ({ open, onClose, variant }) => (
  <Drawer
    variant={variant}
    open={open}
    onClose={onClose}
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        borderRight: 'none',
        background: 'linear-gradient(180deg, #fff7f4 0%, #ffffff 100%)'
      }
    }}
  >
    <Toolbar>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          CS&E Connect
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Department Hub
        </Typography>
      </Box>
    </Toolbar>
    <List sx={{ px: 2 }}>
      {navItems.map((item) => (
        <ListItemButton
          key={item.to}
          component={NavLink}
          to={item.to}
          sx={{
            my: 0.6,
            borderRadius: 999,
            px: 2,
            '&.active': {
              backgroundColor: 'rgba(255, 173, 153, 0.35)',
              '& .MuiListItemIcon-root': { color: 'primary.main' },
              '& .MuiListItemText-primary': { fontWeight: 600 }
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  </Drawer>
);

export { drawerWidth };
export default NavDrawer;
