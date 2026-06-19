import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productType: { type: String, enum: ['AmazonProduct', 'RelifeProduct'], required: true },
  unitId: { type: String }, // Present if it's a RelifeProduct
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  image: { type: String },
  conditionScore: { type: String },
  co2Saved: { type: Number },
  greenCredits: { type: Number },
  resaleStatus: { type: String, enum: ['not_listed', 'listed', 'sold', 'refurbish', 'donate', 'recycle'], default: 'not_listed' },
  resaleListingId: { type: String }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  greenCreditsEarned: { type: Number, default: 0 },
  co2Saved: { type: Number, default: 0 },
  wasteDiverted: { type: Number, default: 0 },
  itemsReused: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: { type: String }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
