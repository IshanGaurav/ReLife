const https = require('https');

const urls = [
  'https://images.unsplash.com/photo-1596462502278-27bf85033c5a?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512496015851-a1cbfc38ca30?q=80&w=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=500&auto=format&fit=crop'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${res.statusCode} - ${url}`);
  }).on('error', (e) => {
    console.error(`Error: ${e.message}`);
  });
});
