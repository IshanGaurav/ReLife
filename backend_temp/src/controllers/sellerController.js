import { Seller } from '../models/Seller.js';
import { User } from '../models/User.js';

export const getSellerDashboard = async (req, res) => {
  try {
    const { sellerId } = req.params;
    let seller;
    
    // Check if sellerId is a valid ObjectId, else assume it's just a mock string fallback
    if (sellerId.match(/^[0-9a-fA-F]{24}$/)) {
      seller = await Seller.findById(sellerId).populate('userId', 'name email');
    } else {
      // For the sake of the mock frontend keeping things simple, return the first seller if ID is generic
      seller = await Seller.findOne().populate('userId', 'name email');
    }

    if (!seller) return res.status(404).json({ message: 'Seller not found' });
    
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
