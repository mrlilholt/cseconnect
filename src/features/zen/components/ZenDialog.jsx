import React, { useEffect, useRef, useState } from 'react';
import { Image, Camera, Quote } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';
import Input from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';

const ZenDialog = ({ open, onClose, onSubmit, initialMoment }) => {
  const MAX_IMAGE_SIZE = 700 * 1024;
  const [text, setText] = useState('');
  const [type, setType] = useState('text');
  const [imageData, setImageData] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialMoment) {
      setText(initialMoment.text || '');
      setType(initialMoment.type || (initialMoment.imageUrl ? 'photo' : 'text'));
      setImageData(initialMoment.imageUrl || '');
      setQuoteAuthor(initialMoment.quoteAuthor || '');
    } else {
      setText('');
      setType('text');
      setImageData('');
      setQuoteAuthor('');
    }
    setError('');
    setDragActive(false);
  }, [initialMoment, open]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (type !== 'photo' && !trimmed) return;
    if (type === 'photo' && !imageData && !trimmed) return;
    onSubmit({
      text: trimmed,
      type,
      imageUrl: imageData,
      quoteAuthor: type === 'quote' ? quoteAuthor.trim() : ''
    });
  };

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

  return (
    <Modal
      open={open}
      title={initialMoment ? 'Edit moment' : 'Share a moment'}
      onClose={onClose}
      actions={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            {initialMoment ? 'Save changes' : 'Share moment'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Moment type</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { value: 'text', label: 'Reflection' },
              { value: 'quote', label: 'Quote' },
              { value: 'photo', label: 'Photo' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setType(option.value)}
                className={`rounded-full px-3 py-1 text-xs ${
                  type === option.value
                    ? 'bg-gradient-to-r from-coral to-neonpink text-white shadow-glow'
                    : 'border border-white/10 text-white/60 hover:bg-white/5'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          rows={4}
          placeholder="Share something calm, grateful, or grounding. Paste a YouTube link for video moments."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        {type === 'quote' && (
          <Input
            placeholder="Quote author (optional)"
            value={quoteAuthor}
            onChange={(event) => setQuoteAuthor(event.target.value)}
          />
        )}

        {type === 'photo' && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Add a photo</p>
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
        )}

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

        <div className="flex items-center gap-2 text-[10px] text-white/40">
          <Quote size={12} className="text-coral" />
          Auto zen quotes appear every 15 minutes to keep the space calm.
        </div>
      </div>
    </Modal>
  );
};

export default ZenDialog;
