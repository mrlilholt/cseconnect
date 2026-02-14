import React from 'react';

const EmptyState = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <p className="text-sm font-semibold text-gradient">{title}</p>
    {subtitle && <p className="mt-2 text-xs text-white/50">{subtitle}</p>}
  </div>
);

export default EmptyState;
