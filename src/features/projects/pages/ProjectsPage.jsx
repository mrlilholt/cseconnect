import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../../lib/auth';
import { createProject, deleteProject, subscribeToProjects, updateProject } from '../api';
import ProjectCard from '../components/ProjectCard';
import ProjectDialog from '../components/ProjectDialog';
import EmptyState from '../../../components/EmptyState';
import Button from '../../../components/ui/Button';
import Skeleton from '../../../components/ui/Skeleton';

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

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

  const showMessage = (message) => {
    setSnackbar({ message });
    setTimeout(() => setSnackbar(null), 3000);
  };

  const handleCreate = async (payload) => {
    try {
      await createProject({ ...payload, ownerUid: user.uid });
      setDialogOpen(false);
      showMessage('Project created.');
    } catch (error) {
      showMessage(error.message || 'Unable to create project.');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await updateProject(editingProject.id, payload);
      setDialogOpen(false);
      setEditingProject(null);
      showMessage('Project updated.');
    } catch (error) {
      showMessage(error.message || 'Unable to update project.');
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      showMessage('Project deleted.');
    } catch (error) {
      showMessage(error.message || 'Unable to delete project.');
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gradient">Side Projects</h2>
          <p className="text-sm text-white/50">Track ideas, active experiments, and launches.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="rounded-[2px] border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/70"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="idea">Idea</option>
            <option value="in_progress">In progress</option>
            <option value="shipping">Shipping</option>
            <option value="done">Done</option>
          </select>
          <Button onClick={openCreate}>
            <Plus size={14} />
            New project
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-40 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No projects yet" subtitle="Start tracking a side project." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              canEdit={project.ownerUid === user.uid}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ProjectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={editingProject ? handleUpdate : handleCreate}
        initialProject={editingProject}
      />

      {snackbar && (
        <div className="fixed bottom-24 right-6 rounded-[2px] border border-white/10 bg-black/70 px-4 py-2 text-xs text-white/80">
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
