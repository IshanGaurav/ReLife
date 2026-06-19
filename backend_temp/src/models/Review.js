import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['product', 'seller'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Can be AmazonProduct, RelifeProduct, or Seller
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  helpfulVotes: { type: Number, default: 0 }
}, { timestamps: true });

export const Review = mongoose.model('Review', reviewSchema);
