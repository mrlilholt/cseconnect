import React from 'react';
import { cn } from '../../lib/cn';

const Avatar = ({ src, fallback, className }) => (
  <div
    className={cn(
      'flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-white',
      className
    )}
  >
    {src ? <img src={src} alt="avatar" className="h-full w-full object-cover" /> : fallback}
  </div>
);

export default Avatar;
