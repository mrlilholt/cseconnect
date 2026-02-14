import React from 'react';
import Card from '../../../components/ui/Card';
import { formatDateTime } from '../../../lib/time';

const statusColor = {
  sent: 'text-emerald-300',
  skipped: 'text-coral',
  failed: 'text-red-300'
};

const AlertsList = ({ alerts }) => (
  <div className="space-y-3">
    {alerts.map((alert) => (
      <Card key={alert.id} className="rounded-[2px]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">{alert.message}</p>
            <p className="mt-1 text-xs text-white/40">{formatDateTime(alert.createdAt)}</p>
            {alert.smsError && <p className="mt-1 text-xs text-red-300">{alert.smsError}</p>}
          </div>
          {alert.smsStatus && (
            <span className={`text-xs font-semibold ${statusColor[alert.smsStatus]}`}>{alert.smsStatus}</span>
          )}
        </div>
      </Card>
    ))}
  </div>
);

export default AlertsList;
