export const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/150';
  const baseUrl = import.meta.env.PROD 
    ? 'https://api.secondlife-api.xyz' 
    : 'http://localhost:5000';
    
  // Fix for images uploaded while running locally but viewed in production
  if (import.meta.env.PROD && url.startsWith('http://localhost:5000')) {
    url = url.replace('http://localhost:5000', 'https://api.secondlife-api.xyz');
  }
    
  if (url.startsWith('http://localhost:5000') || url.startsWith('https://api.secondlife-api.xyz')) return url;
  if (url.startsWith('/api/v2/images')) return `${baseUrl}${url}`;
  if (url.startsWith('/api/images')) return `${baseUrl}/api/v2/images${url.replace('/api/images', '')}`;
  return url;
};
