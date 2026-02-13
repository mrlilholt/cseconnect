import React, { useEffect, useState } from 'react';
import { Box, Skeleton, Typography, Card, CardContent } from '@mui/material';
import { useAuth } from '../../../lib/auth';
import { createAlert, sendBroadcastSms, subscribeToAlerts, updateAlertStatus } from '../api';
import AlertForm from '../components/AlertForm';
import AlertsList from '../components/AlertsList';
import SmsStatusBanner from '../components/SmsStatusBanner';
import EmptyState from '../../../components/EmptyState';

const AlertsPage = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const unsub = subscribeToAlerts((items) => {
      setAlerts(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSend = async (message) => {
    setSending(true);
    setBanner(null);
    try {
      const docRef = await createAlert({ message, user });
      try {
        const result = await sendBroadcastSms(docRef.id);
        const data = result.data || {};
        if (data.configured === false) {
          await updateAlertStatus(docRef.id, {
            smsStatus: 'skipped',
            smsError: 'SMS not configured'
          });
          setBanner({ type: 'skipped' });
        } else if (data.failed && data.failed > 0) {
          setBanner({ type: 'failed', message: 'Some phone numbers failed.' });
        } else {
          setBanner({ type: 'sent' });
        }
      } catch (error) {
        await updateAlertStatus(docRef.id, {
          smsStatus: 'skipped',
          smsError: 'SMS not configured or function unavailable'
        });
        setBanner({ type: 'skipped' });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Alerts
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Broadcast an urgent message to every member.
      </Typography>
      <SmsStatusBanner status={banner} />
      <Card sx={{ mb: 3, borderRadius: 2, border: '1px solid rgba(255, 173, 153, 0.2)' }}>
        <CardContent>
          <AlertForm onSubmit={handleSend} sending={sending} />
        </CardContent>
      </Card>
      {loading ? (
        [0, 1, 2].map((item) => <Skeleton key={item} height={140} sx={{ mb: 2 }} />)
      ) : alerts.length === 0 ? (
        <EmptyState title="No alerts yet" subtitle="Broadcast your first alert when needed." />
      ) : (
        <AlertsList alerts={alerts} />
      )}
    </Box>
  );
};

export default AlertsPage;
