import app from './app.js';
import { env } from './config/env.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('Mongo URI Loaded:', process.env.MONGODB_URI ? 'YES' : 'NO');
console.log('JWT Secret Loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Amazon ReLife API listening on port ${PORT}`);
});
