import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  Box,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { extractYouTubeId, getYouTubeThumbnail } from '../utils';

const TubeCard = ({ tube, canEdit, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const videoId = useMemo(() => extractYouTubeId(tube.url), [tube.url]);
  const thumbnail = useMemo(() => getYouTubeThumbnail(videoId), [videoId]);

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '1px',
        border: '1px solid rgba(255, 173, 153, 0.2)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ p: 1.75, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            borderRadius: '1px',
            border: '1px solid rgba(255, 173, 153, 0.25)',
            overflow: 'hidden',
            backgroundColor: '#fff8f4',
            mb: 1.25
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
              href={tube.url}
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
            href={tube.url}
            target="_blank"
            rel="noreferrer"
            sx={{
              position: 'relative',
              display: 'block',
              height: { xs: 130, md: 140, lg: 150 },
              backgroundColor: '#fff',
              textDecoration: 'none'
            }}
          >
            {thumbnail ? (
              <Box
                component="img"
                src={thumbnail}
                alt={tube.title}
                loading="lazy"
                sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                  fontSize: '0.85rem'
                }}
              >
                Preview unavailable
              </Box>
            )}
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
              <PlayCircleOutlineIcon sx={{ fontSize: 44 }} />
            </Box>
          </Box>
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '1px',
                backgroundColor: 'rgba(255, 173, 153, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main'
              }}
            >
              <YouTubeIcon />
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {tube.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {videoId ? `YouTube • ${videoId}` : 'YouTube'}
              </Typography>
            </Box>
          </Box>
          {canEdit && (
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={() => onEdit(tube)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => setConfirmOpen(true)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Stack>

        {tube.description && (
          <Typography
            color="text.secondary"
            sx={{
              mt: 1.1,
              fontSize: '0.85rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {tube.description}
          </Typography>
        )}
        <Stack direction="row" spacing={1} sx={{ mt: 1.2, flexWrap: 'wrap' }}>
          {tube.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Stack>
      </CardContent>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete tube?"
        description="This will remove the shared video."
        confirmLabel="Delete"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(tube.id);
        }}
      />
    </Card>
  );
};

export default TubeCard;
