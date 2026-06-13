import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tier: { type: String, required: true },
  thresholdAt: { type: Number, required: true },
  awardedAt: { type: Date, default: Date.now }
});

badgeSchema.index({ userId: 1, tier: 1 }, { unique: true });

export const Badge = mongoose.model('Badge', badgeSchema);
