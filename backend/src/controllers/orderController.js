import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { RelifeProduct } from '../models/RelifeProduct.js';
import { GreenCreditTransaction } from '../models/GreenCreditTransaction.js';

export const checkout = async (req, res) => {
  try {
    const { cartItems, shippingData, paymentMethod } = req.body;
    console.log('Incoming order:', req.body);
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    let totalGreenCredits = 0;
    let totalCo2Saved = 0;
    let totalWasteDiverted = 0;
    let totalItemsReused = 0;

    const orderItems = [];

    for (const item of cartItems) {
      // Find the product to verify and calculate impact
      const isRelife = item.productType === 'relife' || item.productType === 'RelifeProduct';
      
      const priceStr = item.relifePrice || item.price || '0';
      const price = parseFloat(priceStr.toString().replace(/,/g, ''));
      totalAmount += (price * (item.quantity || 1));

      let dbProduct = null;
      let creditsEarned = 0;
      let itemCo2Saved = 0;
      let conditionScore = null;

      if (isRelife) {
        dbProduct = await RelifeProduct.findById(item.productId || item._id);
        
        if (dbProduct) {
          totalItemsReused += (item.quantity || 1);
          
          let listingType = 'used';
          if (dbProduct.isUsed === false) {
             listingType = 'open_box';
          } else if (dbProduct.name.toLowerCase().includes('refurbished')) {
             listingType = 'refurbished';
          }

          if (listingType === 'open_box') {
             creditsEarned = 250 * (item.quantity || 1); // 150 to 300
          } else if (listingType === 'refurbished') {
             creditsEarned = 350 * (item.quantity || 1); // 200 to 400
          } else {
             creditsEarned = 150 * (item.quantity || 1); // 100 to 250
          }
          totalGreenCredits += creditsEarned;
          
          // Parse co2Saved string (e.g., "220 kg")
          if (dbProduct.co2Saved) {
            const co2 = parseFloat(dbProduct.co2Saved.replace(/[^\d.-]/g, ''));
            if (!isNaN(co2)) {
              itemCo2Saved = co2;
              totalCo2Saved += co2 * (item.quantity || 1);
            }
          } else {
             // Fallback assumption: 45kg per item
             itemCo2Saved = 45;
             totalCo2Saved += 45 * (item.quantity || 1);
          }
          
          conditionScore = dbProduct.conditionScore || null;
          
          // Rule: 2.5kg waste diverted per item
          totalWasteDiverted += 2.5 * (item.quantity || 1);
        }
      }

      orderItems.push({
        productId: item.productId || item._id,
        productType: isRelife ? 'RelifeProduct' : 'AmazonProduct',
        unitId: item.unitId,
        name: item.name || (dbProduct ? dbProduct.name : 'Unknown Product'),
        price: price,
        quantity: item.quantity || 1,
        image: item.image || (dbProduct ? dbProduct.image : null),
        conditionScore: conditionScore,
        co2Saved: itemCo2Saved,
        greenCredits: creditsEarned
      });
    }

    // Create the Order
    const order = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      greenCreditsEarned: totalGreenCredits,
      co2Saved: totalCo2Saved,
      wasteDiverted: totalWasteDiverted,
      itemsReused: totalItemsReused,
      shippingAddress: shippingData ? `${shippingData.address}, ${shippingData.city}, ${shippingData.state} ${shippingData.pin}` : 'Default Address'
    });

    // Create Ledger Entries per ReLife Item
    for (const item of orderItems) {
      if (item.productType === 'RelifeProduct' && item.greenCredits > 0) {
        await GreenCreditTransaction.create({
          userId: req.user._id,
          type: 'PURCHASE',
          productId: item.productId,
          productName: item.name,
          credits: item.greenCredits,
          co2Saved: item.co2Saved,
          description: `Purchased ReLife Unit (${item.conditionScore || 'Excellent'})`
        });
      }
    }

    // Update User Profile with new metrics
    const user = await User.findById(req.user._id);
    if (user) {
      user.greenCredits += totalGreenCredits;
      user.co2Saved += totalCo2Saved;
      user.itemsReused += totalItemsReused;
      user.totalSustainablePurchases += (totalItemsReused > 0 ? totalAmount : 0);
      user.wasteDiverted += totalWasteDiverted;
      await user.save();
    }

    res.status(201).json({
      success: true,
      order,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        greenCredits: user.greenCredits,
        co2Saved: user.co2Saved,
        itemsReused: user.itemsReused,
        wasteDiverted: user.wasteDiverted
      },
      impact: {
        creditsEarned: totalGreenCredits,
        co2Saved: totalCo2Saved,
        wasteDiverted: totalWasteDiverted
      }
    });

  } catch (error) {
    console.error('CHECKOUT ERROR:', error);
    res.status(500).json({ message: 'Order processing failed', error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('GET MY ORDERS ERROR:', error);
    res.status(500).json({ message: 'Failed to retrieve orders', error: error.message });
  }
};
