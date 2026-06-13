import mongoose from 'mongoose';

const passportSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', unique: true, required: true },
  productName: { type: String, required: true },
  category: { type: String, required: true },
  ownershipHistory: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    from: Date
  }],
  repairHistory: [{
    description: String,
    date: Date
  }],
  inspectionReport: {
    conditionScore: Number,
    scratchAnalysis: String,
    damageDetection: String,
    missingComponents: [String],
    expectedLifespanMonths: Number
  },
  conditionScore: { type: Number, min: 0, max: 100 },
  expectedLifespanMonths: { type: Number },
}, { timestamps: true });

export const ProductPassport = mongoose.model('ProductPassport', passportSchema);
