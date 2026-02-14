import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import TagInput from '../../../components/TagInput';
import Alert from '../../../components/ui/Alert';
import { extractYouTubeId, getYouTubeThumbnail } from '../utils';

const TubeDialog = ({ open, onClose, onSubmit, initialTube }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTube) {
      setTitle(initialTube.title || '');
      setUrl(initialTube.url || '');
      setDescription(initialTube.description || '');
      setTags(initialTube.tags || []);
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setTags([]);
    }
    setError('');
  }, [initialTube, open]);

  const videoId = useMemo(() => extractYouTubeId(url), [url]);
  const thumbnail = useMemo(() => getYouTubeThumbnail(videoId), [videoId]);

  const handleSubmit = () => {
    setError('');
    if (!title.trim() || !url.trim()) return;
    if (!videoId) {
      setError('Enter a valid YouTube URL.');
      return;
    }
    onSubmit({
      title: title.trim(),
      url: url.trim(),
      description: description.trim(),
      tags
    });
  };

  return (
    <Modal
      open={open}
      title={initialTube ? 'Edit tube' : 'Share a tube'}
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {initialTube ? 'Save changes' : 'Share tube'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" />
        <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="YouTube URL" />
        {thumbnail && (
          <div className="overflow-hidden rounded-[2px] border border-white/10">
            <img src={thumbnail} alt="Video preview" className="w-full object-cover" />
          </div>
        )}
        <Textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
        <TagInput tags={tags} onChange={setTags} label="Tags" />
        {error && <Alert variant="warning">{error}</Alert>}
        {!videoId && url.trim().length > 0 && (
          <p className="text-[10px] text-white/40">Supported: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/</p>
        )}
      </div>
    </Modal>
  );
};

export default TubeDialog;
