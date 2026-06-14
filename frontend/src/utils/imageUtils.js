export const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/150';
  const baseUrl = import.meta.env.PROD 
    ? 'http://SecondLife-backend-env.eba-ctpmfh8i.us-east-1.elasticbeanstalk.com' 
    : 'http://localhost:5000';
    
  if (url.startsWith('http://localhost:5000') || url.startsWith('http://SecondLife-backend-env')) return url;
  if (url.startsWith('/api/v2/images')) return `${baseUrl}${url}`;
  if (url.startsWith('/api/images')) return `${baseUrl}/api/v2/images${url.replace('/api/images', '')}`;
  return url;
};
