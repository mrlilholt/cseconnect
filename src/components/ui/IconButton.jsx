import React from 'react';
import { cn } from '../../lib/cn';

const IconButton = ({ children, className, ...props }) => (
  <button
    className={cn(
      'inline-flex h-9 w-9 items-center justify-center rounded-full text-holographic transition hover:text-white',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default IconButton;
