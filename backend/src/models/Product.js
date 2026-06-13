import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, default: null },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  media: [{
    key: String,
    url: String,
    type: { type: String, enum: ['image', 'video'] }
  }],
  source: { type: String, enum: ['relife', 'new', 'openbox'], index: true },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  conditionScore: { type: Number, min: 0, max: 100, default: null },
  disposition: { type: String, enum: ['Resell', 'Refurbish', 'Donate', 'Recycle'], default: null },
  inspectionStatus: { type: String, enum: ['pending', 'inspecting', 'complete', 'failed'], default: 'pending' },
  inspectionReportId: { type: mongoose.Schema.Types.ObjectId, default: null },
  passportId: { type: mongoose.Schema.Types.ObjectId, default: null },
  openBox: {
    certified: { type: Boolean, default: false },
    label: { type: String, default: '' },
  },
  reviews: [{
    rating: Number,
    text: String
  }],
  returnReasons: [{ type: String }],
}, { timestamps: true });

productSchema.index({ name: 'text', category: 'text' });

export const Product = mongoose.model('Product', productSchema);
