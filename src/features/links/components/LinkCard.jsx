import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  Link as MuiLink,
  Box,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import ConfirmDialog from '../../../components/ConfirmDialog';

const LinkCard = ({ linkItem, canEdit, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [previewTimeout, setPreviewTimeout] = useState(false);

  useEffect(() => {
    setPreviewLoaded(false);
    setPreviewTimeout(false);
    const timer = setTimeout(() => setPreviewTimeout(true), 3500);
    return () => clearTimeout(timer);
  }, [linkItem.url]);

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
              href={linkItem.url}
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
            sx={{
              position: 'relative',
              height: { xs: 120, md: 130, lg: 140 },
              backgroundColor: '#fff'
            }}
          >
            <Box
              component="iframe"
              title={linkItem.title}
              src={linkItem.url}
              loading="lazy"
              onLoad={() => setPreviewLoaded(true)}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              referrerPolicy="no-referrer"
              sx={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
            />
            {(!previewLoaded || previewTimeout) && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  px: 2,
                  backgroundColor: 'rgba(255, 247, 244, 0.9)',
                  color: 'text.secondary'
                }}
              >
                <Typography variant="body2">
                  Preview unavailable. Open the link to view the page.
                </Typography>
              </Box>
            )}
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
              <LinkIcon />
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
                {linkItem.title}
              </Typography>
              <MuiLink
                href={linkItem.url}
                target="_blank"
                rel="noreferrer"
                sx={{
                  fontSize: '0.75rem',
                  display: 'inline-block',
                  maxWidth: 220,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {linkItem.url}
              </MuiLink>
            </Box>
          </Box>
          {canEdit && (
            <Stack direction="row" spacing={1}>
              <IconButton size="small" onClick={() => onEdit(linkItem)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => setConfirmOpen(true)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Stack>
        <Typography
          color="text.secondary"
          sx={{
            mt: 1.25,
            fontSize: '0.85rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {linkItem.description}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1.25, flexWrap: 'wrap' }}>
          {linkItem.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Stack>
      </CardContent>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete link?"
        description="This will remove the saved link."
        confirmLabel="Delete"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(linkItem.id);
        }}
      />
    </Card>
  );
};

export default LinkCard;
