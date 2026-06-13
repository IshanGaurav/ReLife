import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'owner', 'seller'], required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  greenCredits: { type: Number, default: 0, min: 0 },
  highestBadge: { type: String, default: null },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
