import React, { useEffect, useRef, useState } from 'react';
import { Image, Camera } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';
import Alert from '../../../components/ui/Alert';

const MAX_IMAGE_SIZE = 700 * 1024; // 700 KB

const NewPostDialog = ({ open, onClose, onSubmit, initialPost }) => {
  const [text, setText] = useState('');
  const [imageData, setImageData] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialPost) {
      setText(initialPost.text || '');
      setImageData(initialPost.imageUrl || '');
    } else {
      setText('');
      setImageData('');
    }
    setError('');
    setDragActive(false);
  }, [initialPost, open]);

  const readFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image too large. Please use an image under 700 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageData(reader.result);
      setError('');
    };
    reader.onerror = () => setError('Unable to read image.');
    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    readFile(file);
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit({
      text: text.trim(),
      imageUrl: imageData || ''
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialPost ? 'Edit post' : 'New post'}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {initialPost ? 'Save changes' : 'Post'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Textarea
          rows={4}
          placeholder="Share something"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Add an image</p>
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-2 flex cursor-pointer flex-col items-center gap-2 rounded-[2px] border border-dashed px-4 py-6 text-center text-xs text-white/50 ${
              dragActive ? 'border-coral bg-white/5' : 'border-white/10 bg-black/40'
            }`}
          >
            <Image size={18} className="text-coral" />
            Drag & drop or tap to upload from camera roll.
            <span className="text-[10px] text-white/30">Max size 700 KB</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => readFile(event.target.files?.[0])}
            style={{ display: 'none' }}
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera size={14} />
            Upload image
          </Button>
        </div>

        {error && <Alert variant="warning">{error}</Alert>}

        {imageData && (
          <div>
            <p className="text-xs text-white/40">Image preview</p>
            <div className="mt-2 overflow-hidden rounded-[2px] border border-white/10">
              <img src={imageData} alt="Preview" className="w-full object-contain" />
            </div>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => setImageData('')}>
              Remove image
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NewPostDialog;
