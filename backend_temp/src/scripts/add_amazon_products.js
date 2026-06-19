import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { AmazonProduct } from '../models/AmazonProduct.js';

const newData = [
  {
    "id": "a1",
    "asin": "AMZ-ECHO-5",
    "name": "Amazon Echo Dot (5th Gen)",
    "category": "Smart Home",
    "price": 4499,
    "rating": 4.8,
    "reviewCount": 12402
  },
  {
    "id": "a2",
    "asin": "AMZ-KINDLE-11",
    "name": "Kindle Paperwhite 11th Gen",
    "category": "Electronics",
    "price": 13999,
    "rating": 4.7,
    "reviewCount": 8456
  },
  {
    "id": "a3",
    "asin": "AMZ-FIRETV-4K",
    "name": "Fire TV Stick 4K",
    "category": "Streaming",
    "price": 5999,
    "rating": 4.7,
    "reviewCount": 21543
  },
  {
    "id": "a4",
    "asin": "SONY-CH720N",
    "name": "Sony WH-CH720N Wireless Headphones",
    "category": "Audio",
    "price": 9990,
    "rating": 4.6,
    "reviewCount": 6543
  },
  {
    "id": "a5",
    "asin": "JBL-770NC",
    "name": "JBL Tune 770NC",
    "category": "Audio",
    "price": 6999,
    "rating": 4.5,
    "reviewCount": 4210
  },
  {
    "id": "a6",
    "asin": "LOGI-MX3S",
    "name": "Logitech MX Master 3S",
    "category": "Accessories",
    "price": 9999,
    "rating": 4.8,
    "reviewCount": 3567
  },
  {
    "id": "a7",
    "asin": "SAMSUNG-T7",
    "name": "Samsung T7 Portable SSD 1TB",
    "category": "Storage",
    "price": 8999,
    "rating": 4.8,
    "reviewCount": 5120
  },
  {
    "id": "a8",
    "asin": "ANKER-PB20K",
    "name": "Anker Power Bank 20000mAh",
    "category": "Accessories",
    "price": 3999,
    "rating": 4.7,
    "reviewCount": 7654
  },
  {
    "id": "a9",
    "asin": "BOAT-141",
    "name": "boAt Airdopes 141",
    "category": "Audio",
    "price": 1799,
    "rating": 4.4,
    "reviewCount": 45231
  }
];

const placeholderImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop';

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const item of newData) {
      const productDoc = {
        originalId: item.id,
        name: item.name,
        price: item.price.toLocaleString('en-IN'),
        oldPrice: (item.price * 1.2).toLocaleString('en-IN'),
        rating: item.rating,
        reviews: item.reviewCount.toLocaleString('en-IN'),
        image: placeholderImage,
        description: `Experience the new ${item.name} with advanced features and superior quality.`,
        category: item.category,
        brand: item.name.split(' ')[0],
        features: [
          'High Quality Performance',
          'Durable and Reliable',
          '1 Year Manufacturer Warranty'
        ],
        specs: {
          Brand: item.name.split(' ')[0],
          Category: item.category,
          ASIN: item.asin
        }
      };

      await AmazonProduct.findOneAndUpdate(
        { originalId: item.id },
        productDoc,
        { upsert: true, new: true }
      );
      console.log(`Upserted: ${item.name}`);
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
