import React from 'react';
import { cn } from '../../lib/cn';

const Card = ({ children, className, ...props }) => (
  <div className={cn('glass-card rounded-[2px] p-4', className)} {...props}>
    {children}
  </div>
);

export default Card;
