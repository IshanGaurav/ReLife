require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Schema = new mongoose.Schema({ status: String }, { strict: false });
  const RelifeProduct = mongoose.model('RelifeProduct', Schema, 'relifeproducts');
  
  const res = await RelifeProduct.updateMany(
    { status: 'SOLD' },
    { $set: { status: 'ACTIVE' }, $unset: { soldAt: '', buyerId: '' } }
  );
  console.log('Reset', res.modifiedCount, 'products');
  process.exit(0);
});
