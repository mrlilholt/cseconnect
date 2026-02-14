import React, { useEffect, useState } from 'react';
import { ExternalLink, Trash2, Edit3, Link2 } from 'lucide-react';
import Card from '../../../components/ui/Card';
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
    <Card className="rounded-[2px]">
      <div className="rounded-[2px] border border-white/10 bg-black/50">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-white/50">
          <div className="flex gap-2">
            <span className="h-2 w-2 rounded-full bg-coral" />
            <span className="h-2 w-2 rounded-full bg-neonpink" />
            <span className="h-2 w-2 rounded-full bg-white/30" />
          </div>
          <a
            href={linkItem.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-coral"
          >
            <ExternalLink size={12} /> Open
          </a>
        </div>
        <div className="relative h-32 bg-black">
          <iframe
            title={linkItem.title}
            src={linkItem.url}
            loading="lazy"
            onLoad={() => setPreviewLoaded(true)}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            referrerPolicy="no-referrer"
            className="h-full w-full border-none pointer-events-none"
          />
          {(!previewLoaded || previewTimeout) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-xs text-white/50">
              Preview unavailable
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-[2px] border border-white/10 bg-black/60">
            <Link2 size={14} className="text-coral" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/90 line-clamp-1">{linkItem.title}</p>
            <a href={linkItem.url} target="_blank" rel="noreferrer" className="text-xs text-coral line-clamp-1">
              {linkItem.url}
            </a>
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2 text-white/50">
            <button onClick={() => onEdit(linkItem)}>
              <Edit3 size={14} />
            </button>
            <button className="text-coral" onClick={() => setConfirmOpen(true)}>
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {linkItem.description && <p className="mt-2 text-xs text-white/50 line-clamp-2">{linkItem.description}</p>}
      {linkItem.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {linkItem.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/50">
              {tag}
            </span>
          ))}
        </div>
      )}

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
