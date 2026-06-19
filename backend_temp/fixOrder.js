
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://divyanshu_db_user:n3e8ED1tVu2cZ1qu@cluster0.dmdnpub.mongodb.net/amazon_relife?appName=Cluster0')
  .then(async () => {
    const Order = mongoose.model('Order', new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        items: [{
            productId: { type: mongoose.Schema.Types.ObjectId, required: true },
            name: String,
            price: Number,
            image: String,
            productType: { type: String, enum: ['AmazonProduct', 'RelifeProduct'] },
            resaleStatus: { type: String, enum: ['not_listed', 'listed', 'sold'], default: 'not_listed' },
            resaleListingId: String
        }],
        totalAmount: Number,
        status: { type: String, default: 'delivered' }
    }, { timestamps: true }));

    // Delete the bad order
    await Order.deleteMany({ 'items.name': 'Sony WH-1000XM5 Wireless Headphones' });
    console.log('Deleted old bad orders.');

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const users = await User.find({ name: /divyanshu/i });

    if (users.length > 0) {
        const newOrder = await Order.create({
            userId: users[0]._id,
            items: [{
                productId: new mongoose.Types.ObjectId(), // generate a valid random object id
                name: 'Sony WH-1000XM5 Wireless Headphones',
                price: 29990,
                image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._SX522_.jpg',
                productType: 'AmazonProduct',
                resaleStatus: 'not_listed'
            }],
            totalAmount: 29990,
            status: 'delivered'
        });
        console.log('Created valid order:', newOrder._id);
    }
    process.exit(0);
  });
