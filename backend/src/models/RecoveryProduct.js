import mongoose from 'mongoose';

const recoveryProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  returningCustomerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conditionScore: { type: Number, min: 0, max: 100, required: true },
  recoveryEligible: { type: Boolean, required: true },
  productValue: { type: Number, required: true },
  logisticsCost: { type: Number, required: true },
  recoveryRatio: { type: Number, default: null },
  routingDecision: { type: String, enum: ['Return To Seller', 'Nearby Recovery Hub'], required: true },
  recoveryHubId: { type: mongoose.Schema.Types.ObjectId, default: null },
}, { timestamps: true });

export const RecoveryProduct = mongoose.model('RecoveryProduct', recoveryProductSchema);
