import React, { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';

const ProjectDialog = ({ open, onClose, onSubmit, initialProject }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('idea');
  const [links, setLinks] = useState([{ label: '', url: '' }]);

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title || '');
      setDescription(initialProject.description || '');
      setStatus(initialProject.status || 'idea');
      setLinks(initialProject.links || [{ label: '', url: '' }]);
    } else {
      setTitle('');
      setDescription('');
      setStatus('idea');
      setLinks([{ label: '', url: '' }]);
    }
  }, [initialProject, open]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      links: links.filter((link) => link.label && link.url)
    });
  };

  const updateLink = (index, key, value) => {
    setLinks((prev) => prev.map((link, i) => (i === index ? { ...link, [key]: value } : link)));
  };

  const addLink = () => {
    setLinks((prev) => [...prev, { label: '', url: '' }]);
  };

  const removeLink = (index) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal
      open={open}
      title={initialProject ? 'Edit project' : 'New project'}
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {initialProject ? 'Save changes' : 'Create project'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Project title" />
        <Textarea
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the project"
        />
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-white/40">Status</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {['idea', 'in_progress', 'shipping', 'done'].map((value) => (
              <button
                key={value}
                onClick={() => setStatus(value)}
                className={`rounded-full px-3 py-1 text-xs ${
                  status === value ? 'bg-gradient-to-r from-coral to-neonpink text-white shadow-glow' : 'border border-white/10 text-white/50'
                }`}
              >
                {value.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-white/40">Links</label>
          <div className="mt-2 space-y-2">
            {links.map((link, index) => (
              <div key={index} className="flex flex-col gap-2 sm:flex-row">
                <Input
                  className="rounded-[2px]"
                  value={link.label}
                  onChange={(event) => updateLink(index, 'label', event.target.value)}
                  placeholder="Label"
                />
                <Input
                  className="rounded-[2px]"
                  value={link.url}
                  onChange={(event) => updateLink(index, 'url', event.target.value)}
                  placeholder="URL"
                />
                {links.length > 1 && (
                  <button
                    className="text-xs text-coral"
                    onClick={() => removeLink(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-2" onClick={addLink}>
            Add link
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectDialog;
