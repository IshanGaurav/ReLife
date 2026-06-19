
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://divyanshu_db_user:n3e8ED1tVu2cZ1qu@cluster0.dmdnpub.mongodb.net/amazon_relife?appName=Cluster0')
  .then(async () => {
    const RelifeProduct = mongoose.model('RelifeProduct', new mongoose.Schema({}, { strict: false }));
    const products = await RelifeProduct.find();
    console.log('Total RelifeProducts:', products.length);
    const nameCounts = {};
    products.forEach(p => {
      nameCounts[p.name] = (nameCounts[p.name] || 0) + 1;
    });
    console.log('Duplicate counts:', Object.keys(nameCounts).filter(k => nameCounts[k] > 1).map(k => k + ': ' + nameCounts[k]));
    process.exit(0);
  });
