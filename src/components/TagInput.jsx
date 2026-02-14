import React, { useState } from 'react';
import Input from './ui/Input';
import Chip from './ui/Chip';

const TagInput = ({ label = 'Tags', tags, onChange }) => {
  const [value, setValue] = useState('');

  const handleAdd = (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const next = value.trim().replace(/,$/, '');
      if (next && !tags.includes(next)) {
        onChange([...tags, next]);
      }
      setValue('');
    }
  };

  const handleDelete = (tag) => {
    onChange(tags.filter((item) => item !== tag));
  };

  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-white/40">{label}</label>
      <Input
        className="mt-2"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleAdd}
        placeholder="Type and press Enter"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Chip key={tag} label={tag} onDelete={() => handleDelete(tag)} />
        ))}
      </div>
    </div>
  );
};

export default TagInput;
