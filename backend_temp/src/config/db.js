import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import { runSeed } from '../scripts/seed.js';

dotenv.config();

let mongod = null;

export const connectDB = async () => {
  try {
    let dbUri = process.env.MONGODB_URI;
    let isMemory = false;

    // If no URI is provided in .env, spin up an in-memory MongoDB instance automatically
    if (!dbUri) {
      console.log('No MONGODB_URI found in .env. Starting in-memory MongoDB instance...');
      mongod = await MongoMemoryServer.create();
      dbUri = mongod.getUri();
      isMemory = true;
    }

    await mongoose.connect(dbUri);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);

    // Auto-seed if using in-memory so the frontend always has data
    if (isMemory) {
      console.log('Auto-seeding in-memory database...');
      await runSeed();
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error.message}`);
    process.exit(1);
  }
};
