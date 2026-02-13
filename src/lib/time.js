export const formatDateTime = (value) => {
  if (!value) return '';
  const date = value.toDate ? value.toDate() : value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

export const formatDate = (value) => {
  if (!value) return '';
  const date = value.toDate ? value.toDate() : value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium'
  }).format(date);
};
