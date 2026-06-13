import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  greenCredits: { type: Number, default: 0 },
  co2Saved: { type: Number, default: 0 },
  itemsReused: { type: Number, default: 0 },
  totalSustainablePurchases: { type: Number, default: 0 },
  wasteDiverted: { type: Number, default: 0 },
  role: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  cartItems: [{
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    productType: { type: String, enum: ['amazon', 'relife'], required: true },
    quantity: { type: Number, default: 1 },
    name: String,
    price: mongoose.Schema.Types.Mixed,
    image: String
  }]
}, { timestamps: true });

// Pre-save hook to hash password if it was modified
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);
