import mongoose from 'mongoose';

const unitSchema = new mongoose.Schema({
  unitId: { type: String, required: true },
  conditionScore: { type: Number, required: true },
  conditionLabel: { type: String, required: true },
  price: { type: String, required: true },
  batteryHealth: { type: String },
  sellerName: { type: String },
  sellerRating: { type: String },
  warrantyMonths: { type: Number },
  inspectionSummary: { type: String },
  passportId: { type: String },
  distance: { type: String }
});

const relifeProductSchema = new mongoose.Schema({
  originalId: { type: String, required: true, unique: true }, // The 'u1', 'o1' from mockData
  originalAsin: { type: String }, // Links to AmazonProduct.originalId
  isUsed: { type: Boolean, default: true },
  name: { type: String, required: true },
  originalPrice: { type: String },
  relifePrice: { type: String, required: true },
  conditionScore: { type: Number },
  distance: { type: String },
  passportAvailable: { type: Boolean, default: false },
  aiVerified: { type: Boolean, default: false },
  sellerRating: { type: Number },
  sellerReviews: { type: Number },
  image: { type: String, required: true },
  category: { type: String },
  co2Saved: { type: String },
  greenCredits: { type: Number },
  discountPercent: { type: Number },
  availableUnits: [unitSchema]
}, { timestamps: true });

relifeProductSchema.index({ name: 'text', category: 'text' });

export const RelifeProduct = mongoose.model('RelifeProduct', relifeProductSchema);
