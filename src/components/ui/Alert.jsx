import React from 'react';
import { cn } from '../../lib/cn';

const variants = {
  info: 'border-neonpink/40 text-holographic',
  success: 'border-emerald-400/40 text-emerald-200',
  warning: 'border-coral/40 text-coral',
  error: 'border-red-400/40 text-red-200'
};

const Alert = ({ children, variant = 'info', className }) => (
  <div
    className={cn(
      'glass-card rounded-[2px] border px-4 py-3 text-sm',
      variants[variant],
      className
    )}
  >
    {children}
  </div>
);

export default Alert;
