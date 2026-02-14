import React from 'react';
import { cn } from '../../lib/cn';
import IconButton from './IconButton';

const Modal = ({ open, title, onClose, children, actions, className }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={cn('relative w-full max-w-lg glass-card rounded-[2px] p-5 text-holographic', className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gradient">{title}</h3>
          <IconButton onClick={onClose}>
            ✕
          </IconButton>
        </div>
        <div className="mt-4">{children}</div>
        {actions && <div className="mt-5 flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default Modal;
