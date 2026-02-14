import React from 'react';
import { cn } from '../../lib/cn';

const variants = {
  primary: 'bg-gradient-to-r from-coral to-neonpink text-white shadow-glow',
  outline: 'border border-white/20 text-holographic hover:border-white/40',
  ghost: 'text-holographic hover:text-white'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base'
};

const Button = ({ children, variant = 'primary', size = 'md', className, as, ...props }) => {
  const Component = as || 'button';
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
