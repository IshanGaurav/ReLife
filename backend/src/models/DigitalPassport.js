import mongoose from 'mongoose';

const digitalPassportSchema = new mongoose.Schema({
  passportId: { type: String, required: true, unique: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'RelifeProduct', required: true },
  unitId: { type: String, required: true },
  aiInspectionLogs: [{
    date: { type: Date, default: Date.now },
    summary: { type: String },
    score: { type: Number }
  }],
  history: [{
    event: { type: String },
    date: { type: Date, default: Date.now }
  }],
  repairRecords: [{
    repairType: { type: String },
    date: { type: Date, default: Date.now },
    notes: { type: String }
  }]
}, { timestamps: true });

export const DigitalPassport = mongoose.model('DigitalPassport', digitalPassportSchema);
