import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { AmazonProduct } from '../models/AmazonProduct.js';
import { RelifeProduct } from '../models/RelifeProduct.js';

const originalIdsAmazon = ['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9'];
const originalIdsRelife = ['o10', 'o11', 'o12', 'o13', 'o14', 'o15', 'o16', 'o17', 'o18'];

async function deleteData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const amazonDeleteResult = await AmazonProduct.deleteMany({ originalId: { $in: originalIdsAmazon } });
    console.log(`Deleted ${amazonDeleteResult.deletedCount} items from AmazonProduct collection.`);

    const relifeDeleteResult = await RelifeProduct.deleteMany({ originalId: { $in: originalIdsRelife } });
    console.log(`Deleted ${relifeDeleteResult.deletedCount} items from RelifeProduct collection.`);

    console.log('Deletion complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting data:', error);
    process.exit(1);
  }
}

deleteData();
