import { GreenCreditTransaction } from '../models/GreenCreditTransaction.js';

export const getTransactions = async (req, res) => {
  try {
    const transactions = await GreenCreditTransaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error('GET TRANSACTIONS ERROR:', error);
    res.status(500).json({ message: 'Failed to retrieve transactions', error: error.message });
  }
};

export const getCreditBalance = async (req, res) => {
  try {
    const result = await GreenCreditTransaction.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          total: {
            $sum: {
              $cond: [
                { $eq: ["$type", "REDEEM"] },
                { $multiply: ["$credits", -1] },
                "$credits"
              ]
            }
          }
        }
      }
    ]);
    
    const balance = result.length > 0 ? result[0].total : 0;
    
    res.status(200).json({ success: true, balance });
  } catch (error) {
    console.error('GET CREDIT BALANCE ERROR:', error);
    res.status(500).json({ message: 'Failed to retrieve balance', error: error.message });
  }
};
