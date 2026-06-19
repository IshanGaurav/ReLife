import mongoose from 'mongoose';

const creditSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['Resell', 'Donate', 'Recycle', 'BuyRefurbished', 'Return'], required: true },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
}, { timestamps: true });

export const Credit = mongoose.model('Credit', creditSchema);
