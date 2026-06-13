import mongoose from 'mongoose';

const amazonProductSchema = new mongoose.Schema({
  originalId: { type: String, required: true, unique: true }, // The 'a1', 'a2' from mockData
  name: { type: String, required: true },
  price: { type: String, required: true },
  oldPrice: { type: String },
  rating: { type: Number },
  reviews: { type: String },
  image: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  brand: { type: String },
  features: [{ type: String }],
  specs: { type: Map, of: String }
}, { timestamps: true });

amazonProductSchema.index({ name: 'text', brand: 'text', category: 'text' });

export const AmazonProduct = mongoose.model('AmazonProduct', amazonProductSchema);
