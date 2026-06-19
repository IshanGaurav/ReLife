
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://divyanshu_db_user:n3e8ED1tVu2cZ1qu@cluster0.dmdnpub.mongodb.net/amazon_relife?appName=Cluster0')
  .then(async () => {
    const RelifeProduct = mongoose.model('RelifeProduct', new mongoose.Schema({}, { strict: false }));
    const products = await RelifeProduct.find().sort({ _id: -1 });
    
    console.log('Total RelifeProducts:', products.length);
    const seen = new Set();
    const toDelete = [];
    
    products.forEach(p => {
        // Group by sourceOrderId and sourceItemId, or by name if those are missing
        const key = p.sourceItemId ? String(p.sourceItemId) : String(p.name);
        if (seen.has(key)) {
            toDelete.push(p._id);
        } else {
            seen.add(key);
        }
    });

    if (toDelete.length > 0) {
        await RelifeProduct.deleteMany({ _id: { $in: toDelete } });
        console.log('Deleted', toDelete.length, 'duplicate products');
    } else {
        console.log('No duplicates found.');
    }
    process.exit(0);
  });
