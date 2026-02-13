import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';
import { useAuth } from '../lib/auth';
import AccessDeniedPage from '../pages/AccessDeniedPage';

const ProtectedRoute = () => {
  const { status } = useAuth();

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === 'denied') {
    return <AccessDeniedPage />;
  }

  if (status === 'signedOut') {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
