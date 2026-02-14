import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'w-full rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-holographic placeholder:text-white/30 backdrop-blur-xl focus:border-coral focus:outline-none',
      className
    )}
    {...props}
  />
));

Input.displayName = 'Input';

export default Input;
