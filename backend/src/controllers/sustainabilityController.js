import { Order } from '../models/Order.js';
import { GreenCreditTransaction } from '../models/GreenCreditTransaction.js';

export const getSustainabilityData = async (req, res) => {
  try {
    const userId = req.params.userId === 'me' ? req.user._id : req.params.userId;
    
    // Default months structure (last 6 months including current)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      last6Months.push({
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        name: months[d.getMonth()]
      });
    }

    // 1. Fetch Orders (Purchases)
    const orders = await Order.find({ userId }).sort({ createdAt: 1 });
    
    // 2. Fetch Green Credit Transactions (All activities)
    const transactions = await GreenCreditTransaction.find({ userId });

    let totalCo2Saved = 0;
    let totalWasteDiverted = 0;
    let totalCreditsEarned = 0;
    let totalItemsReused = orders.length;

    // Calculate total credits from transactions (sum of all positive/negative)
    transactions.forEach(t => {
      if (t.type !== 'REDEEM') {
        totalCreditsEarned += (t.credits || 0);
      } else {
        totalCreditsEarned -= (Math.abs(t.credits || 0));
      }
      totalCo2Saved += (t.co2Saved || 0);
    });

    // Initialize chart data with 0s for the last 6 months
    const chartMap = {};
    last6Months.forEach(m => {
      chartMap[`${m.year}-${m.monthIndex}`] = {
        name: m.name,
        co2: 0,
        waste: 0,
        credits: 0,
        items: 0
      };
    });

    // Aggregate graph data exclusively from purchases/orders to show impact over time
    orders.forEach(order => {
      totalWasteDiverted += (order.wasteDiverted || 0);

      const d = new Date(order.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      
      if (chartMap[key]) {
        chartMap[key].co2 += (order.co2Saved || 0);
        chartMap[key].waste += (order.wasteDiverted || 0);
        chartMap[key].credits += (order.greenCreditsEarned || 0);
        chartMap[key].items += (order.itemsReused || 1);
      }
    });

    // Also plot transaction credits into the graph so recycling shows up
    transactions.forEach(t => {
      const d = new Date(t.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (chartMap[key]) {
        // If it's a recycle/sell, it might not be an order, but we should plot the credits and CO2
        // We only add to chart if it wasn't already covered by the Order loop to avoid double counting
        // Wait, Order checkout creates a transaction. If we plot both, credits will double.
        // Let's only plot orders for the graph as requested.
      }
    });

    const monthlyTrend = last6Months.map(m => chartMap[`${m.year}-${m.monthIndex}`]);
    const treesEquivalent = Math.floor(totalCo2Saved / 10);

    res.status(200).json({
      success: true,
      monthlyTrend,
      co2Saved: parseFloat(totalCo2Saved.toFixed(2)),
      wasteDiverted: parseFloat(totalWasteDiverted.toFixed(2)),
      greenCredits: totalCreditsEarned,
      itemsReused: totalItemsReused,
      treesEquivalent
    });

  } catch (error) {
    console.error('SUSTAINABILITY DATA ERROR:', error);
    res.status(500).json({ message: 'Failed to retrieve sustainability data', error: error.message });
  }
};
