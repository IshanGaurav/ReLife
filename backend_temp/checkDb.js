import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AmazonProduct } from './src/models/AmazonProduct.js';
import { RelifeProduct } from './src/models/RelifeProduct.js';
import { User } from './src/models/User.js';
import { Order } from './src/models/Order.js';

dotenv.config();

const checkDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('--- Database Status ---');
    
    const amazonCount = await AmazonProduct.countDocuments();
    console.log(`Amazon Products: ${amazonCount}`);

    const relifeCount = await RelifeProduct.countDocuments();
    const usedCount = await RelifeProduct.countDocuments({ isUsed: true });
    const openBoxCount = await RelifeProduct.countDocuments({ isUsed: false });
    console.log(`ReLife Products: ${relifeCount} (${usedCount} Used, ${openBoxCount} Open Box)`);

    const userCount = await User.countDocuments();
    console.log(`Users: ${userCount}`);

    const orderCount = await Order.countDocuments();
    console.log(`Orders: ${orderCount}`);

    console.log('-----------------------');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkDb();
