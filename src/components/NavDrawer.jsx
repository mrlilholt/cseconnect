import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Rss,
  Layers,
  HelpCircle,
  Link2,
  Youtube,
  MessageSquare,
  Bell,
  UserCircle,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/cn';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Feed', icon: Rss, to: '/feed' },
  { label: 'Projects', icon: Layers, to: '/projects' },
  { label: 'Q&A', icon: HelpCircle, to: '/qa' },
  { label: 'Links', icon: Link2, to: '/links' },
  { label: 'Tubes', icon: Youtube, to: '/tubes' },
  { label: 'Moments of ZEN', icon: Sparkles, to: '/zen' },
  { label: 'Messages', icon: MessageSquare, to: '/messages' },
  { label: 'Alerts', icon: Bell, to: '/alerts' },
  { label: 'Profile', icon: UserCircle, to: '/profile' }
];

const NavDrawer = ({ open, onClose }) => (
  <div
    className={cn(
      'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-black/80 backdrop-blur-2xl transition-transform duration-200 md:translate-x-0',
      open ? 'translate-x-0' : '-translate-x-full'
    )}
  >
    <div className="flex items-center justify-between px-6 py-5 md:py-6">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="CS&E Connect"
          className="h-10 w-auto rounded-[2px] object-contain"
        />
        <span className="sr-only">CS&E Connect</span>
      </div>
      <button className="text-white/60 md:hidden" onClick={onClose}>
        ✕
      </button>
    </div>
    <nav className="flex flex-col gap-2 px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-[2px] px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-white/50 font-extralight transition',
                isActive ? 'bg-white/5 text-white shadow-glow' : 'hover:bg-white/5'
              )
            }
            onClick={onClose}
          >
            <Icon size={18} />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  </div>
);

export default NavDrawer;
