import React from 'react';

const LoadingScreen = ({ label = 'Loading...' }) => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-coral border-t-transparent" />
    <p className="text-xs text-white/50">{label}</p>
  </div>
);

export default LoadingScreen;
