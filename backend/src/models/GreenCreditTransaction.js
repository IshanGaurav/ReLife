import mongoose from 'mongoose';

const greenCreditTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['PURCHASE', 'SELL', 'RESELL', 'REFURBISH', 'RECYCLE', 'DONATE', 'REDEEM'], required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'RelifeProduct' },
  productName: { type: String, required: true },
  credits: { type: Number, required: true },
  co2Saved: { type: Number, default: 0 },
  description: { type: String, required: true },
}, { timestamps: true });

export const GreenCreditTransaction = mongoose.model('GreenCreditTransaction', greenCreditTransactionSchema);
