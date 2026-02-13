import { members } from '../config/members';

export const normalizeEmail = (email) => (email ? email.trim().toLowerCase() : '');

export const sanitizeEmail = (email) => normalizeEmail(email).replace(/\./g, ',');

export const isAllowedLocal = (email) => {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  return members.some((member) => {
    const memberEmail = typeof member === 'string' ? member : member.email;
    return normalizeEmail(memberEmail) === normalized;
  });
};

export const getMemberDisplayName = (email) => {
  const normalized = normalizeEmail(email);
  const entry = members.find((member) => {
    const memberEmail = typeof member === 'string' ? member : member.email;
    return normalizeEmail(memberEmail) === normalized;
  });
  if (entry && typeof entry === 'object' && entry.name) {
    return entry.name;
  }
  return '';
};
