import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'seller' },
  sellerRating: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  businessName: { type: String, default: '' },
  reviewsCount: { type: Number, default: 0 },
  activeListings: { type: Number, default: 0 },
  greenScore: { type: Number, default: 0 }
}, { timestamps: true });

sellerSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export const Seller = mongoose.model('Seller', sellerSchema);
