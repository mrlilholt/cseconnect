import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  Link,
  Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmDialog from '../../../components/ConfirmDialog';

const statusMap = {
  idea: { label: 'Idea', color: 'default' },
  in_progress: { label: 'In progress', color: 'info' },
  shipping: { label: 'Shipping', color: 'warning' },
  done: { label: 'Done', color: 'success' }
};

const ProjectCard = ({ project, canEdit, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const status = statusMap[project.status] || statusMap.idea;

  return (
    <Card sx={{ height: '100%', borderRadius: 2, border: '1px solid rgba(255, 173, 153, 0.2)' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {project.title}
            </Typography>
            <Chip
              label={status.label}
              color={status.color}
              size="small"
              sx={{ mt: 1, textTransform: 'capitalize' }}
            />
          </Box>
          {canEdit && (
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => onEdit(project)} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => setConfirmOpen(true)} size="small" color="error">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Stack>
        <Typography sx={{ mt: 2 }} color="text.secondary">
          {project.description}
        </Typography>
        {project.links?.length > 0 && (
          <Stack spacing={0.5} sx={{ mt: 2 }}>
            {project.links.map((link) => (
              <Link key={link.url} href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </Link>
            ))}
          </Stack>
        )}
      </CardContent>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete project?"
        description="This will remove the project from the board."
        confirmLabel="Delete"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(project.id);
        }}
      />
    </Card>
  );
};

export default ProjectCard;
