import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';
import { MongoMemoryServer } from 'mongodb-memory-server';

const PORT = env.port || 3000;

async function startServer() {
  let mongoUri = env.mongoUri;

  if (!mongoUri || mongoUri.includes('localhost')) {
    console.log('No external MONGO_URI detected, starting an in-memory MongoDB instance for local testing...');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
  }

  try {
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB: ${mongoUri}`);
    
    app.listen(PORT, () => {
      console.log(`Amazon ReLife API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

startServer();
