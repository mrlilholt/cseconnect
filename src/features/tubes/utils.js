export const extractYouTubeId = (url) => {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '');
    if (host === 'youtu.be') {
      return parsed.pathname.slice(1).split('/')[0] || null;
    }
    if (host.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/watch')) {
        return parsed.searchParams.get('v');
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/')[2] || null;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/')[2] || null;
      }
      if (parsed.pathname.startsWith('/live/')) {
        return parsed.pathname.split('/')[2] || null;
      }
    }
  } catch (error) {
    return null;
  }
  return null;
};

export const getYouTubeThumbnail = (videoId) => {
  if (!videoId) return '';
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

export const getEmbedUrl = (videoId) => {
  if (!videoId) return '';
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
};
