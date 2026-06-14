import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AmazonProduct } from './src/models/AmazonProduct.js';
import { RelifeProduct } from './src/models/RelifeProduct.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await AmazonProduct.find().limit(2);
    if (products.length === 0) {
      console.log('No Amazon products found to seed against.');
      process.exit(0);
    }

    const p1 = products[0]; // Sony WH-1000XM5
    
    // Create an open box product for it
    const openBoxP1 = new RelifeProduct({
      originalId: 'ob_' + p1.originalId,
      originalAsin: p1.originalId,
      isUsed: false,
      name: p1.name,
      category: p1.category || 'Electronics',
      originalPrice: p1.price,
      relifePrice: (parseFloat(p1.price.replace(/,/g, '')) * 0.7).toLocaleString('en-IN'), // 30% off
      image: p1.image,
      images: p1.images,
      status: 'ACTIVE',
      availableUnits: [
        {
          unitId: 'unit_ob_' + p1.originalId,
          conditionScore: 98,
          conditionLabel: 'Like New',
          price: (parseFloat(p1.price.replace(/,/g, '')) * 0.7).toLocaleString('en-IN'),
          inspectionSummary: 'Box opened, product unused. Original packaging intact.',
          warrantyMonths: 12
        }
      ]
    });

    await RelifeProduct.deleteOne({ originalId: openBoxP1.originalId });
    await openBoxP1.save();
    console.log(`Seeded Open Box item for: ${p1.name}`);

    if (products.length > 1) {
      const p2 = products[1];
      const openBoxP2 = new RelifeProduct({
        originalId: 'ob_' + p2.originalId,
        originalAsin: p2.originalId,
        isUsed: false,
        name: p2.name,
        category: p2.category || 'Electronics',
        originalPrice: p2.price,
        relifePrice: (parseFloat(p2.price.replace(/,/g, '')) * 0.8).toLocaleString('en-IN'), // 20% off
        image: p2.image,
        images: p2.images,
        status: 'ACTIVE',
        availableUnits: [
          {
            unitId: 'unit_ob_' + p2.originalId,
            conditionScore: 95,
            conditionLabel: 'Like New',
            price: (parseFloat(p2.price.replace(/,/g, '')) * 0.8).toLocaleString('en-IN'),
            inspectionSummary: 'Minor damage to outer packaging. Product verified perfectly functional.',
            warrantyMonths: 6
          }
        ]
      });
      await RelifeProduct.deleteOne({ originalId: openBoxP2.originalId });
      await openBoxP2.save();
      console.log(`Seeded Open Box item for: ${p2.name}`);
    }

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
