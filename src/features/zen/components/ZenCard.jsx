import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  Box,
  Avatar,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { formatDateTime } from '../../../lib/time';
import { extractYouTubeId, getYouTubeThumbnail } from '../../tubes/utils';

const findFirstUrl = (text) => {
  if (!text) return '';
  const match = text.match(/https?:\/\/\S+/i);
  return match ? match[0] : '';
};

const ZenCard = ({ moment, canEdit, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const url = useMemo(() => findFirstUrl(moment.text), [moment.text]);
  const videoId = useMemo(() => extractYouTubeId(url), [url]);
  const thumbnail = useMemo(() => getYouTubeThumbnail(videoId), [videoId]);

  return (
    <Card sx={{ borderRadius: 24, border: '1px solid rgba(255, 173, 153, 0.2)' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack direction="row" spacing={2}>
            <Avatar sx={{ width: 44, height: 44, backgroundColor: 'rgba(255, 173, 153, 0.4)' }}>
              {moment.authorName?.[0] || 'Z'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {moment.authorName || 'Member'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDateTime(moment.createdAt)}
              </Typography>
            </Box>
          </Stack>
          {canEdit && (
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={() => onEdit(moment)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => setConfirmOpen(true)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Stack>

        {videoId && (
          <Box
            sx={{
              mt: 2,
              borderRadius: '1px',
              border: '1px solid rgba(255, 173, 153, 0.25)',
              overflow: 'hidden',
              backgroundColor: '#fff8f4'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                py: 0.75,
                backgroundColor: 'rgba(255, 173, 153, 0.15)',
                borderBottom: '1px solid rgba(255, 173, 153, 0.2)'
              }}
            >
              <Stack direction="row" spacing={1}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FF7D6E' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FFAD99' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F2B166' }} />
              </Stack>
              <Button
                component="a"
                href={url}
                target="_blank"
                rel="noreferrer"
                size="small"
                variant="outlined"
                sx={{ borderRadius: '1px', px: 1.5, minWidth: 0, fontSize: '0.75rem' }}
              >
                Open
              </Button>
            </Box>
            <Box
              component="a"
              href={url}
              target="_blank"
              rel="noreferrer"
              sx={{
                position: 'relative',
                display: 'block',
                height: { xs: 160, md: 180 },
                backgroundColor: '#fff',
                textDecoration: 'none'
              }}
            >
              <Box
                component="img"
                src={thumbnail}
                alt="Zen video"
                loading="lazy"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.45), rgba(0,0,0,0.05))'
                }}
              >
                <PlayCircleOutlineIcon sx={{ fontSize: 48 }} />
              </Box>
            </Box>
          </Box>
        )}

        <Typography sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>{moment.text}</Typography>
      </CardContent>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete moment?"
        description="This will remove the moment from the board."
        confirmLabel="Delete"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(moment.id);
        }}
      />
    </Card>
  );
};

export default ZenCard;
