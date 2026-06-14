export const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/150';
  if (url.startsWith('http://localhost:5000')) return url;
  if (url.startsWith('/api/v2/images')) return `http://localhost:5000${url}`;
  if (url.startsWith('/api/images')) return `http://localhost:5000/api/v2/images${url.replace('/api/images', '')}`;
  return url;
};
