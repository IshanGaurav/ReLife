import mongoose from 'mongoose';

const circularActionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sourceOrderId: { type: String, required: true },
  sourceItemId: { type: String, required: true },
  actionType: { type: String, enum: ['RESELL', 'REFURBISH', 'RECYCLE', 'DONATE'], required: true },
  creditsEarned: { type: Number, default: 0 },
  status: { type: String, default: 'COMPLETED' },
  modelName: { type: String },
  originalPrice: { type: Number }
}, { timestamps: true });

export const CircularAction = mongoose.model('CircularAction', circularActionSchema);
