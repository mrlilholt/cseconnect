import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/auth';
import { createAlert, sendBroadcastSms, subscribeToAlerts, updateAlertStatus } from '../api';
import AlertForm from '../components/AlertForm';
import AlertsList from '../components/AlertsList';
import SmsStatusBanner from '../components/SmsStatusBanner';
import EmptyState from '../../../components/EmptyState';
import Card from '../../../components/ui/Card';
import Skeleton from '../../../components/ui/Skeleton';

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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gradient">Alerts</h2>
        <p className="text-sm text-white/50">Broadcast an urgent message to every member.</p>
      </div>
      <SmsStatusBanner status={banner} />
      <Card className="rounded-[2px]">
        <AlertForm onSubmit={handleSend} sending={sending} />
      </Card>
      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-28 w-full" />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState title="No alerts yet" subtitle="Broadcast your first alert when needed." />
      ) : (
        <AlertsList alerts={alerts} />
      )}
    </div>
  );
};

export default AlertsPage;
