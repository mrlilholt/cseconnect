export const isValidE164 = (value) => {
  if (!value) return false;
  return /^\+[1-9]\d{1,14}$/.test(value.trim());
};
