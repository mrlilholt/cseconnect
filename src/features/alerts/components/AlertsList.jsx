import React from 'react';
import { Card, CardContent, Chip, Stack, Typography, Box } from '@mui/material';
import { formatDateTime } from '../../../lib/time';

const statusColor = {
  sent: 'success',
  skipped: 'warning',
  failed: 'error'
};

const AlertsList = ({ alerts }) => (
  <Stack spacing={2}>
    {alerts.map((alert) => (
      <Card key={alert.id} sx={{ borderRadius: 2, border: '1px solid rgba(255, 173, 153, 0.2)' }}>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {alert.message}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {formatDateTime(alert.createdAt)}
              </Typography>
              {alert.smsError && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {alert.smsError}
                </Typography>
              )}
            </Box>
            {alert.smsStatus && (
              <Chip label={alert.smsStatus} color={statusColor[alert.smsStatus]} size="small" />
            )}
          </Stack>
        </CardContent>
      </Card>
    ))}
  </Stack>
);

export default AlertsList;
