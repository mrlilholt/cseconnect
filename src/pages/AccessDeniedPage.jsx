import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const AccessDeniedPage = () => {
  const navigate = useNavigate();
  const { deniedEmail } = useAuth();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-lg rounded-[2px]">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="CS&E Connect logo" className="h-10 w-10 rounded-[2px]" />
          <h2 className="text-xl font-semibold text-gradient font-display">Access not granted</h2>
        </div>
        <p className="mt-3 text-sm text-white/50">
          {deniedEmail
            ? `The account ${deniedEmail} is not on the department allowlist.`
            : 'Your account is not on the department allowlist.'}
        </p>
        <Button className="mt-6" onClick={() => navigate('/signin')}>
          Back to sign in
        </Button>
      </Card>
    </div>
  );
};

export default AccessDeniedPage;
