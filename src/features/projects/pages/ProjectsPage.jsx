import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
  Skeleton,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../../lib/auth';
import { createProject, deleteProject, subscribeToProjects, updateProject } from '../api';
import ProjectCard from '../components/ProjectCard';
import ProjectDialog from '../components/ProjectDialog';
import EmptyState from '../../../components/EmptyState';

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const unsub = subscribeToProjects((items) => {
      setProjects(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((project) => project.status === filter);
  }, [projects, filter]);

  const showMessage = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreate = async (payload) => {
    try {
      await createProject({ ...payload, ownerUid: user.uid });
      setDialogOpen(false);
      showMessage('Project created.');
    } catch (error) {
      showMessage(error.message || 'Unable to create project.', 'error');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateProject(editingProject.id, payload);
      setDialogOpen(false);
      setEditingProject(null);
      showMessage('Project updated.');
    } catch (error) {
      showMessage(error.message || 'Unable to update project.', 'error');
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      showMessage('Project deleted.');
    } catch (error) {
      showMessage(error.message || 'Unable to delete project.', 'error');
    }
  };

  const openCreate = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Side Projects
          </Typography>
          <Typography color="text.secondary">Track ideas, active experiments, and launches.</Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Select
            size="small"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            sx={{
              borderRadius: 999,
              backgroundColor: '#fff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 173, 153, 0.5)'
              }
            }}
          >
            <MenuItem value="all">All statuses</MenuItem>
            <MenuItem value="idea">Idea</MenuItem>
            <MenuItem value="in_progress">In progress</MenuItem>
            <MenuItem value="shipping">Shipping</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New project
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Grid container spacing={2}>
          {[0, 1, 2].map((item) => (
            <Grid item xs={12} md={6} key={item}>
              <Skeleton height={220} />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <EmptyState title="No projects yet" subtitle="Start tracking a side project." />
      ) : (
        <Grid container spacing={2}>
          {filtered.map((project) => (
            <Grid item xs={12} md={6} key={project.id}>
              <ProjectCard
                project={project}
                canEdit={project.ownerUid === user.uid}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <ProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={editingProject ? handleUpdate : handleCreate}
        initialProject={editingProject}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectsPage;
