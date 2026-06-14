
import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://divyanshu_db_user:n3e8ED1tVu2cZ1qu@cluster0.dmdnpub.mongodb.net/amazon_relife?appName=Cluster0')
  .then(async () => {
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const users = await User.find({ name: /divyanshu/i });
    console.log('Users:', JSON.stringify(users, null, 2));
    if (users.length > 0) {
        const Order = mongoose.model('Order', new mongoose.Schema({
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            items: [{
                productId: String,
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
        const newOrder = await Order.create({
            userId: users[0]._id,
            items: [{
                productId: 'DUMMY-AMZ-101',
                name: 'Sony WH-1000XM5 Wireless Headphones',
                price: 29990,
                image: 'https://m.media-amazon.com/images/I/51aXvjzcukL._SX522_.jpg',
                productType: 'AmazonProduct',
                resaleStatus: 'not_listed'
            }],
            totalAmount: 29990,
            status: 'delivered'
        });
        console.log('Created order:', newOrder._id);
    }
    process.exit(0);
  });
