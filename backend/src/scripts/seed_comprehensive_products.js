import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { AmazonProduct } from '../models/AmazonProduct.js';
import { RelifeProduct } from '../models/RelifeProduct.js';

// The comprehensive data blueprint
const productsData = [
  {
    "id": "a1",
    "asin": "AMZ-ECHO-5",
    "name": "Amazon Echo Dot (5th Gen)",
    "category": "Smart Home",
    "price": 4499,
    "rating": 4.8,
    "reviewCount": 12402,
    "image": "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop",
    "description": "The all-new Echo Dot (5th Gen) offers our best audio experience yet, with clearer vocals, deeper bass, and vibrant sound in any room. Alexa is always ready to help you play music, set timers, answer questions, and control compatible smart home devices with just your voice.",
    "features": [
      "Vibrant sound with deeper bass and clearer vocals",
      "Control compatible smart home devices via voice or built-in motion/temperature sensors",
      "Designed with privacy in mind with a mic off button",
      "Seamlessly connect with other Echo devices for multi-room audio",
      "Stream your favorite music from Amazon Music, Spotify, Apple Music and more"
    ],
    "specs": { "Brand": "Amazon", "Model Name": "Echo Dot 5th Gen", "Speaker Type": "Smart Speaker", "Connectivity": "Wi-Fi, Bluetooth", "Weight": "340g" },
    "openBox": { "discountPercent": 35, "conditionScore": 95, "co2Saved": "4.5 kg", "greenCredits": 150, "warranty": 6, "inspection": "Cosmetic scratch on base. Speaker grill intact. Full diagnostic passed." }
  },
  {
    "id": "a2",
    "asin": "AMZ-KINDLE-11",
    "name": "Kindle Paperwhite 11th Gen",
    "category": "Electronics",
    "price": 13999,
    "rating": 4.7,
    "reviewCount": 8456,
    "image": "https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=800&auto=format&fit=crop",
    "description": "Lose yourself in a book with the Kindle Paperwhite 11th Gen. Featuring a 6.8” display, thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns. It's waterproof (IPX8) so you can read and relax at the beach, by the pool, or in the bath.",
    "features": [
      "6.8” display with adjustable warm light",
      "Waterproof (IPX8) for reading anywhere",
      "Up to 10 weeks of battery life on a single charge",
      "Flush-front design and 300 ppi glare-free display",
      "Pair with Audible via Bluetooth headphones"
    ],
    "specs": { "Brand": "Amazon", "Screen Size": "6.8 Inches", "Storage capacity": "8 GB", "Color": "Black", "Waterproof": "Yes (IPX8)" },
    "openBox": { "discountPercent": 25, "conditionScore": 98, "co2Saved": "7.2 kg", "greenCredits": 300, "warranty": 12, "inspection": "Like new. Original packaging opened. No scratches on screen or casing." }
  },
  {
    "id": "a3",
    "asin": "AMZ-FIRETV-4K",
    "name": "Fire TV Stick 4K",
    "category": "Streaming",
    "price": 5999,
    "rating": 4.7,
    "reviewCount": 21543,
    "image": "https://images.unsplash.com/photo-1606788075765-d603a1109a15?w=800&auto=format&fit=crop",
    "description": "Unlock a complete 4K Ultra HD experience with the Fire TV Stick 4K. With support for leading HDR formats, Dolby Vision, and Dolby Atmos audio, it brings your entertainment to life. Stream hundreds of thousands of movies and TV episodes effortlessly.",
    "features": [
      "Brilliant 4K Ultra HD streaming quality",
      "Alexa Voice Remote included for easy searching",
      "Support for Dolby Vision, HDR10+, and Dolby Atmos",
      "Access over 1 million movies and TV episodes",
      "Easy to set up and remains hidden behind your TV"
    ],
    "specs": { "Brand": "Amazon", "Resolution": "4K Ultra HD", "Audio": "Dolby Atmos", "Connector Type": "HDMI", "Storage": "8 GB" },
    "openBox": { "discountPercent": 40, "conditionScore": 92, "co2Saved": "2.1 kg", "greenCredits": 100, "warranty": 3, "inspection": "Remote shows minor wear. Stick is perfectly functional. HDMI extender included." }
  },
  {
    "id": "a4",
    "asin": "SONY-CH720N",
    "name": "Sony WH-CH720N Wireless Headphones",
    "category": "Audio",
    "price": 9990,
    "rating": 4.6,
    "reviewCount": 6543,
    "image": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop",
    "description": "Immerse yourself in music with the Sony WH-CH720N Noise Cancelling Wireless Headphones. Designed for all-day comfort, they feature Dual Noise Sensor technology and the Integrated Processor V1 to block out background noise, so you can focus on what you're listening to.",
    "features": [
      "Sony’s lightest Wireless Noise Cancelling headband",
      "Up to 35 hours of battery life with quick charging",
      "Integrated Processor V1 for premium audio quality",
      "Precise Voice Pickup technology for crystal clear calls",
      "Multipoint connection allows pairing with two devices"
    ],
    "specs": { "Brand": "Sony", "Form Factor": "Over Ear", "Connectivity": "Wireless Bluetooth", "Noise Control": "Active Noise Cancellation", "Battery Life": "35 Hours" },
    "openBox": { "discountPercent": 30, "conditionScore": 96, "co2Saved": "5.5 kg", "greenCredits": 200, "warranty": 6, "inspection": "Earpads are pristine. Missing original USB-C charging cable. Tested 100% functional." }
  },
  {
    "id": "a5",
    "asin": "JBL-770NC",
    "name": "JBL Tune 770NC",
    "category": "Audio",
    "price": 6999,
    "rating": 4.5,
    "reviewCount": 4210,
    "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop",
    "description": "Experience JBL Pure Bass Sound with the Tune 770NC wireless over-ear headphones. Adaptive Noise Cancelling lets you tune out distractions, while Ambient Aware and TalkThru keep you connected to your surroundings. Enjoy up to 70 hours of pure musical bliss.",
    "features": [
      "Adaptive Noise Cancelling with Smart Ambient",
      "JBL Pure Bass Sound for deep, powerful audio",
      "Up to 70 hours of battery life (with BT on and ANC off)",
      "Lightweight, comfortable, and foldable design",
      "Customize your listening experience via the JBL Headphones app"
    ],
    "specs": { "Brand": "JBL", "Form Factor": "Over Ear", "Connectivity": "Wireless", "Noise Control": "Adaptive Noise Cancelling", "Battery": "70 Hours" },
    "openBox": { "discountPercent": 45, "conditionScore": 88, "co2Saved": "4.8 kg", "greenCredits": 180, "warranty": 3, "inspection": "Scuffs on the outer left cup. Audio output perfectly balanced. Fully sanitized." }
  },
  {
    "id": "a6",
    "asin": "LOGI-MX3S",
    "name": "Logitech MX Master 3S",
    "category": "Accessories",
    "price": 9999,
    "rating": 4.8,
    "reviewCount": 3567,
    "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop",
    "description": "Master your workflow with the Logitech MX Master 3S. It features Quiet Clicks, delivering the same satisfying feel with 90% less click noise, and an 8000 DPI optical sensor that tracks anywhere—even on glass. MagSpeed electromagnetic scrolling is fast enough to scroll 1,000 lines a second.",
    "features": [
      "Any-surface tracking with 8K DPI sensor",
      "Quiet Clicks for 90% less distraction",
      "MagSpeed electromagnetic scrolling",
      "Ergonomic silhouette crafted for your hand",
      "Multi-device, multi-OS seamless connection"
    ],
    "specs": { "Brand": "Logitech", "Movement Detection": "Optical", "Connectivity": "Bluetooth, USB Receiver", "Buttons": "7", "Battery Life": "70 Days" },
    "openBox": { "discountPercent": 20, "conditionScore": 99, "co2Saved": "1.2 kg", "greenCredits": 80, "warranty": 12, "inspection": "Customer return within 7 days. Brand new condition. Protective plastics still applied." }
  },
  {
    "id": "a7",
    "asin": "SAMSUNG-T7",
    "name": "Samsung T7 Portable SSD 1TB",
    "category": "Storage",
    "price": 8999,
    "rating": 4.8,
    "reviewCount": 5120,
    "image": "https://images.unsplash.com/photo-1632363197607-bbbc444747cc?w=800&auto=format&fit=crop",
    "description": "The light, pocket-sized Portable SSD T7 delivers fast speeds with easy and reliable data storage for transferring large files. Embedded PCIe NVMe technology facilitates sequential read/write speeds of up to 1,050/1,000 MB/s, respectively.",
    "features": [
      "Transfer files nearly 9.5x faster than hard disk drives",
      "Read/Write speeds up to 1050/1000 MB/s",
      "Shock-resistant metal casing withstands drops from up to 2 meters",
      "Advanced heat control keeps the drive cool",
      "Password protection via AES 256-bit hardware encryption"
    ],
    "specs": { "Brand": "Samsung", "Capacity": "1 TB", "Interface": "USB 3.2 Gen 2", "Read Speed": "1050 MB/s", "Color": "Indigo Blue" },
    "openBox": { "discountPercent": 15, "conditionScore": 100, "co2Saved": "0.5 kg", "greenCredits": 50, "warranty": 12, "inspection": "Box damaged in transit. Drive verified zero write cycles. 100% healthy." }
  },
  {
    "id": "a8",
    "asin": "ANKER-PB20K",
    "name": "Anker Power Bank 20000mAh",
    "category": "Accessories",
    "price": 3999,
    "rating": 4.7,
    "reviewCount": 7654,
    "image": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop",
    "description": "Never run out of power with the Anker 20000mAh Power Bank. It provides multiple charges for your essential devices on the go. Equipped with PowerIQ technology to deliver the fastest possible charge, it supports simultaneous dual-device charging.",
    "features": [
      "Ultra-high 20000mAh capacity provides over 4 phone charges",
      "Anker's MultiProtect safety system ensures complete protection",
      "Simultaneous charging for 2 devices",
      "Universal compatibility with most USB devices",
      "Sleek and portable design"
    ],
    "specs": { "Brand": "Anker", "Capacity": "20000 mAh", "Ports": "2 USB-A, 1 USB-C", "Fast Charging": "Yes", "Weight": "342g" },
    "openBox": { "discountPercent": 50, "conditionScore": 85, "co2Saved": "2.8 kg", "greenCredits": 120, "warranty": 3, "inspection": "Visible scratches on the back casing. Battery cells passed high-load stress test perfectly." }
  },
  {
    "id": "a9",
    "asin": "BOAT-141",
    "name": "boAt Airdopes 141",
    "category": "Audio",
    "price": 1799,
    "rating": 4.4,
    "reviewCount": 45231,
    "image": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop",
    "description": "Unplug yourself from all cables and enjoy true wireless freedom with the boAt Airdopes 141. Experience immersive audio with 8mm drivers, a monstrous playback time of up to 42 hours, and ASAP Charge technology that offers 75 mins of playtime in just 5 mins of charging.",
    "features": [
      "Up to 42 hours of total playback time",
      "ASAP Charge: 5 mins charge = 75 mins playtime",
      "BEAST Mode for low latency gaming",
      "ENx Environmental Noise Cancellation for clear calls",
      "IPX4 water and sweat resistance"
    ],
    "specs": { "Brand": "boAt", "Form Factor": "In Ear", "Connectivity": "Bluetooth 5.1", "Waterproof": "IPX4", "Battery Life": "42 Hours" },
    "openBox": { "discountPercent": 30, "conditionScore": 94, "co2Saved": "1.1 kg", "greenCredits": 60, "warranty": 6, "inspection": "Case has minor scuffs. Earbuds themselves are untouched. UV sterilized." }
  }
];

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const item of productsData) {
      // 1. Upsert AmazonProduct (Retail)
      const retailDoc = {
        originalId: item.id,
        name: item.name,
        price: item.price.toLocaleString('en-IN'),
        oldPrice: Math.floor(item.price * 1.3).toLocaleString('en-IN'),
        rating: item.rating,
        reviews: item.reviewCount.toLocaleString('en-IN'),
        image: item.image,
        description: item.description,
        category: item.category,
        brand: item.specs.Brand || item.name.split(' ')[0],
        features: item.features,
        specs: item.specs
      };

      await AmazonProduct.findOneAndUpdate(
        { originalId: item.id },
        retailDoc,
        { upsert: true, new: true }
      );
      console.log(`[RETAIL] Upserted: ${retailDoc.name}`);

      // 2. Upsert RelifeProduct (Open Box)
      const relifePrice = Math.floor(item.price * (1 - item.openBox.discountPercent / 100));
      
      const openBoxDoc = {
        originalId: `o${item.id.replace('a', '')}`,
        originalAsin: item.asin,
        isUsed: false,
        name: `(Open Box) ${item.name}`,
        originalPrice: item.price.toLocaleString('en-IN'),
        relifePrice: relifePrice.toLocaleString('en-IN'),
        conditionScore: item.openBox.conditionScore,
        distance: `${(Math.random() * 5 + 1).toFixed(1)} km away`,
        passportAvailable: true,
        aiVerified: true,
        sellerRating: 4.8,
        sellerReviews: Math.floor(Math.random() * 500) + 50,
        image: item.image,
        category: item.category,
        co2Saved: item.openBox.co2Saved,
        greenCredits: item.openBox.greenCredits,
        discountPercent: item.openBox.discountPercent,
        availableUnits: [
          {
            unitId: `unit-o${item.id.replace('a', '')}-1`,
            conditionScore: item.openBox.conditionScore,
            conditionLabel: item.openBox.conditionScore >= 98 ? 'Open Box - Like New' : (item.openBox.conditionScore >= 95 ? 'Open Box - Very Good' : 'Open Box - Good'),
            price: relifePrice.toLocaleString('en-IN'),
            batteryHealth: '100%',
            sellerName: 'Amazon Return Center',
            sellerRating: '4.8',
            warrantyMonths: item.openBox.warranty,
            inspectionSummary: item.openBox.inspection,
            passportId: `PP-OB-${item.asin}-${Date.now().toString().slice(-6)}`
          }
        ]
      };

      await RelifeProduct.findOneAndUpdate(
        { originalId: openBoxDoc.originalId },
        openBoxDoc,
        { upsert: true, new: true }
      );
      console.log(`[OPEN BOX] Upserted: ${openBoxDoc.name}`);
    }

    console.log('\n✅ Comprehensive Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
