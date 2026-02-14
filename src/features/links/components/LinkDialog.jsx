import React, { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import TagInput from '../../../components/TagInput';

const LinkDialog = ({ open, onClose, onSubmit, initialLink }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (initialLink) {
      setTitle(initialLink.title || '');
      setUrl(initialLink.url || '');
      setDescription(initialLink.description || '');
      setTags(initialLink.tags || []);
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setTags([]);
    }
  }, [initialLink, open]);

  const handleSubmit = () => {
    if (!title.trim() || !url.trim()) return;
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
      title={initialLink ? 'Edit link' : 'Save link'}
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {initialLink ? 'Save changes' : 'Save link'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" />
        <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="URL" />
        <Textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
        <TagInput tags={tags} onChange={setTags} />
      </div>
    </Modal>
  );
};

export default LinkDialog;
