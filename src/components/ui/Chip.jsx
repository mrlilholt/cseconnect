import React from 'react';
import { cn } from '../../lib/cn';

const Chip = ({ label, onDelete, className }) => (
  <span className={cn('inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-holographic', className)}>
    {label}
    {onDelete && (
      <button onClick={onDelete} className="text-white/50 hover:text-white">
        ✕
      </button>
    )}
  </span>
);

export default Chip;
