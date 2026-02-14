import React from 'react';
import { cn } from '../../lib/cn';

const Skeleton = ({ className }) => (
  <div className={cn('animate-pulse rounded-[2px] bg-white/10', className)} />
);

export default Skeleton;
