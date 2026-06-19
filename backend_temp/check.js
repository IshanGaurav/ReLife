import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './src/config/db.js';
import { AmazonProduct } from './src/models/AmazonProduct.js';
import { RelifeProduct } from './src/models/RelifeProduct.js';

import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await connectDB();
  
  const kindle = await AmazonProduct.findOne({ originalId: 'a2' });
  console.log("Kindle:", kindle ? kindle.name : 'Not found');
  
  const sony = await RelifeProduct.findOne({ originalId: 'u6' });
  console.log("Sony used:", sony ? sony.name : 'Not found');
  
  const matches = await RelifeProduct.find({ originalAsin: 'a2', status: 'ACTIVE' });
  console.log("RelifeProducts with originalAsin a2:", matches.length);
  
  await disconnectDB();
}

run();
