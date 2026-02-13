import React, { useState } from 'react';
import { Box, Chip, TextField } from '@mui/material';

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
    <Box>
      <TextField
        label={label}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleAdd}
        placeholder="Type and press Enter"
        fullWidth
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {tags.map((tag) => (
          <Chip key={tag} label={tag} onDelete={() => handleDelete(tag)} />
        ))}
      </Box>
    </Box>
  );
};

export default TagInput;
