import React, { useState } from 'react';
import { ExternalLink, Trash2, Edit3 } from 'lucide-react';
import Card from '../../../components/ui/Card';
import ConfirmDialog from '../../../components/ConfirmDialog';

const statusMap = {
  idea: { label: 'Idea', color: 'text-white/60' },
  in_progress: { label: 'In progress', color: 'text-coral' },
  shipping: { label: 'Shipping', color: 'text-neonpink' },
  done: { label: 'Done', color: 'text-emerald-300' }
};

const ProjectCard = ({ project, canEdit, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const status = statusMap[project.status] || statusMap.idea;

  return (
    <Card className="rounded-[2px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{project.title}</p>
          <span className={`text-xs ${status.color}`}>{status.label}</span>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2 text-white/50">
            <button onClick={() => onEdit(project)}>
              <Edit3 size={16} />
            </button>
            <button onClick={() => setConfirmOpen(true)} className="text-coral">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-white/50">{project.description}</p>
      {project.links?.length > 0 && (
        <div className="mt-3 space-y-2">
          {project.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs text-coral hover:text-neonpink"
            >
              <ExternalLink size={12} />
              {link.label}
            </a>
          ))}
        </div>
      )}
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
