import React, { useMemo, useState } from 'react';
import { Edit3, Trash2, PlayCircle, Copy } from 'lucide-react';
import Card from '../../../components/ui/Card';
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
  const [copied, setCopied] = useState(false);
  const url = useMemo(() => findFirstUrl(moment.text), [moment.text]);
  const videoId = useMemo(() => extractYouTubeId(url), [url]);
  const thumbnail = useMemo(() => getYouTubeThumbnail(videoId), [videoId]);
  const isPhoto = Boolean(moment.imageUrl);
  const isQuote = moment.type === 'quote';
  const isAuto = Boolean(moment.isAuto);

  const handleCopy = async () => {
    const author = moment.quoteAuthor || moment.authorName || '';
    const payload = author ? `"${moment.text}" — ${author}` : `"${moment.text}"`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <Card className="rounded-[2px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">
            {isAuto ? 'Zen Bot' : moment.authorName || 'Member'}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <span>{formatDateTime(moment.createdAt)}</span>
            {isAuto && <span className="text-[10px] uppercase tracking-[0.2em] text-coral/70">Auto</span>}
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2 text-white/50">
            <button onClick={() => onEdit(moment)}>
              <Edit3 size={16} />
            </button>
            <button className="text-coral" onClick={() => setConfirmOpen(true)}>
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {videoId && (
        <div className="mt-3 overflow-hidden rounded-[2px] border border-white/10 bg-black/50">
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs text-white/50">
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-coral" />
              <span className="h-2 w-2 rounded-full bg-neonpink" />
              <span className="h-2 w-2 rounded-full bg-white/30" />
            </div>
            <a href={url} target="_blank" rel="noreferrer" className="text-coral">
              Open
            </a>
          </div>
          <a href={url} target="_blank" rel="noreferrer" className="relative block h-40 bg-black">
            <img src={thumbnail} alt="Zen video" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <PlayCircle size={40} className="text-white" />
            </div>
          </a>
        </div>
      )}

      {isPhoto && (
        <div className="mt-3 overflow-hidden rounded-[2px] border border-white/10 bg-black/60">
          <a href={moment.imageUrl} target="_blank" rel="noreferrer" className="block">
            <img src={moment.imageUrl} alt="Zen moment" className="h-48 w-full object-cover zen-pulse" />
          </a>
        </div>
      )}

      {isQuote && (
        <div className="mt-3 rounded-[2px] border border-white/10 p-4 text-center text-white/80 zen-quote zen-float">
          <p className="text-lg font-semibold">“{moment.text}”</p>
          <p className="mt-2 text-xs text-white/60">{moment.quoteAuthor || moment.authorName || 'Unknown'}</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/60 hover:bg-white/5"
              onClick={handleCopy}
            >
              <Copy size={12} />
              {copied ? 'Copied' : 'Copy quote'}
            </button>
            {moment.sourceUrl && (
              <a href={moment.sourceUrl} target="_blank" rel="noreferrer" className="text-[10px] text-coral">
                {moment.sourceName || 'Source'}
              </a>
            )}
          </div>
        </div>
      )}

      {!isQuote && moment.text && (
        <p className="mt-3 text-sm text-white/70 whitespace-pre-wrap">{moment.text}</p>
      )}

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
