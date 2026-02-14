import React, { useMemo, useState } from 'react';
import { PlayCircle, Trash2, Edit3, Youtube } from 'lucide-react';
import Card from '../../../components/ui/Card';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { extractYouTubeId, getYouTubeThumbnail } from '../utils';

const TubeCard = ({ tube, canEdit, onEdit, onDelete }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const videoId = useMemo(() => extractYouTubeId(tube.url), [tube.url]);
  const thumbnail = useMemo(() => getYouTubeThumbnail(videoId), [videoId]);

  return (
    <Card className="rounded-[2px]">
      <div className="rounded-[2px] border border-white/10 bg-black/50">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-white/50">
          <div className="flex gap-2">
            <span className="h-2 w-2 rounded-full bg-coral" />
            <span className="h-2 w-2 rounded-full bg-neonpink" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
          </div>
          <a href={tube.url} target="_blank" rel="noreferrer" className="text-coral">
            Open
          </a>
        </div>
        <a href={tube.url} target="_blank" rel="noreferrer" className="relative block h-36 bg-black">
          {thumbnail ? (
            <img src={thumbnail} alt={tube.title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-white/40">Preview unavailable</div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <PlayCircle size={40} className="text-white" />
          </div>
        </a>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-white/10 bg-black/60">
            <Youtube size={16} className="text-coral" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90 line-clamp-1">{tube.title}</p>
            <p className="text-[10px] text-white/40">{videoId ? `YouTube • ${videoId}` : 'YouTube'}</p>
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2 text-white/50">
            <button onClick={() => onEdit(tube)}>
              <Edit3 size={14} />
            </button>
            <button className="text-coral" onClick={() => setConfirmOpen(true)}>
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {tube.description && <p className="mt-2 text-xs text-white/50 line-clamp-2">{tube.description}</p>}
      {tube.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tube.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/50">
              {tag}
            </span>
          ))}
        </div>
      )}

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
