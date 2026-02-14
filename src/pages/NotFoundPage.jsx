import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="py-16 text-center">
      <img src="/logo.png" alt="CS&E Connect logo" className="mx-auto h-12 w-12 rounded-[2px]" />
      <h1 className="mt-4 text-3xl font-semibold text-gradient font-display">Page not found</h1>
      <p className="mt-3 text-sm text-white/50">This page does not exist. Head back to the dashboard.</p>
      <Button className="mt-6" onClick={() => navigate('/')}>Go to dashboard</Button>
    </div>
  );
};

export default NotFoundPage;
