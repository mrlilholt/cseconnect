import React from 'react';
import { cn } from '../../lib/cn';

const Textarea = ({ className, ...props }) => (
  <textarea
    className={cn(
      'w-full rounded-[2px] border border-white/15 bg-black/40 px-4 py-3 text-sm text-holographic placeholder:text-white/30 backdrop-blur-xl focus:border-coral focus:outline-none',
      className
    )}
    {...props}
  />
);

export default Textarea;
