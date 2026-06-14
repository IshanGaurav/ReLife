import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://Ishan:Ishan2004@cluster0.p7xol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(async () => {
  const db = mongoose.connection.db;
  const files = await db.collection('uploads.files').find().sort({uploadDate:-1}).limit(2).toArray();
  console.log('GridFS Files:', files);

  const RelifeProduct = require('./models/RelifeProduct.js').default;
  const latest = await RelifeProduct.findOne({ isUsed: true }).sort({ _id: -1 });
  console.log('Latest product image:', latest ? latest.image : 'None');
  
  process.exit(0);
});
