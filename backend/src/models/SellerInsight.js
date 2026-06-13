import mongoose from 'mongoose';

const sellerInsightSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewSummary: { type: String, default: '' },
  topComplaints: [{
    category: String,
    percentage: Number
  }],
  improvementSuggestions: [{ type: String }],
  dominantComplaint: {
    category: String,
    percentage: Number
  },
  empty: { type: Boolean, default: false }
}, { timestamps: true });

export const SellerInsight = mongoose.model('SellerInsight', sellerInsightSchema);
