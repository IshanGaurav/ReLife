import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { RelifeProduct } from '../models/RelifeProduct.js';
import { GreenCreditTransaction } from '../models/GreenCreditTransaction.js';
import { Notification } from '../models/Notification.js';
import { ProductPassport } from '../models/ProductPassport.js';

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
        const pId = item.productId || item._id;
        if (String(pId).match(/^[0-9a-fA-F]{24}$/)) {
          dbProduct = await RelifeProduct.findById(pId);
        } else {
          dbProduct = await RelifeProduct.findOne({ originalId: pId });
        }
        
        if (dbProduct && dbProduct.status === 'SOLD') {
          return res.status(400).json({ message: `Sorry, ${dbProduct.name} has already been sold.` });
        }
        
        // Mathematical formula: 1 credit per ₹100
        creditsEarned = Math.floor(price / 100) * (item.quantity || 1);
        totalGreenCredits += creditsEarned;
        
        totalItemsReused += (item.quantity || 1);
        
        if (dbProduct) {
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
        } else {
          // Fallback if db product is missing
          itemCo2Saved = 45;
          totalCo2Saved += 45 * (item.quantity || 1);
          conditionScore = 90;
        }
        
        // Rule: 2.5kg waste diverted per item
        totalWasteDiverted += 2.5 * (item.quantity || 1);
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

    // Create Ledger Entries per ReLife Item and handle SOLD state
    for (const item of orderItems) {
      if (item.productType === 'RelifeProduct' || item.productType === 'relife') {
        if (item.greenCredits > 0) {
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
        
        // Mark the RelifeProduct as SOLD
        let dbProductToUpdate = null;
        if (String(item.productId).match(/^[0-9a-fA-F]{24}$/)) {
          dbProductToUpdate = await RelifeProduct.findById(item.productId);
        } else {
          dbProductToUpdate = await RelifeProduct.findOne({ originalId: item.productId });
        }
        
        if (dbProductToUpdate) {
          console.log(`[Order Controller] Before Purchase: Product ${dbProductToUpdate.name} status = ${dbProductToUpdate.status}`);
          
          dbProductToUpdate.status = 'SOLD';
          dbProductToUpdate.soldAt = new Date();
          dbProductToUpdate.buyerId = req.user._id;
          dbProductToUpdate.transactionId = order._id;
          await dbProductToUpdate.save();
          
          console.log(`[Order Controller] After Purchase: Product ${dbProductToUpdate.name} status = ${dbProductToUpdate.status}`);

          // Transfer Product Passport Ownership
          const passport = await ProductPassport.findOne({ productId: dbProductToUpdate._id });
          if (passport) {
            passport.ownershipHistory.push({
              userId: req.user._id,
              name: req.user.name,
              from: new Date()
            });
            await passport.save();
          }

          // Update Seller
          if (dbProductToUpdate.listingOwnerId) {
            const seller = await User.findById(dbProductToUpdate.listingOwnerId);
            if (seller) {
              seller.soldCount = (seller.soldCount || 0) + 1;
              await seller.save();

              // Create Notification
              await Notification.create({
                userId: seller._id,
                title: 'Product Sold',
                message: `Your listing '${dbProductToUpdate.name}' has been purchased successfully.`,
                type: 'SALE',
                relatedItemId: dbProductToUpdate._id
              });
            }
          }
        }  
          // If it was a resell item, update the source order item's resaleStatus
          if (dbProductToUpdate && dbProductToUpdate.sourceOrderId && dbProductToUpdate.sourceItemId) {
            const sourceOrder = await Order.findById(dbProductToUpdate.sourceOrderId);
            if (sourceOrder) {
              const sourceItem = sourceOrder.items.id(dbProductToUpdate.sourceItemId) || sourceOrder.items.find(i => i._id.toString() === dbProductToUpdate.sourceItemId.toString());
              if (sourceItem) {
                sourceItem.resaleStatus = 'sold';
                await sourceOrder.save();
              }
            }
          }
        }
    }

    // Update User Profile with new metrics
    const user = await User.findById(req.user._id);
    let previousBalance = 0;
    if (user) {
      previousBalance = user.greenCredits || 0;
      user.greenCredits += totalGreenCredits;
      user.lifetimeCreditsEarned = (user.lifetimeCreditsEarned || 0) + totalGreenCredits;
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
        lifetimeCreditsEarned: user.lifetimeCreditsEarned,
        co2Saved: user.co2Saved,
        itemsReused: user.itemsReused,
        wasteDiverted: user.wasteDiverted
      },
      impact: {
        previousBalance,
        newBalance: user ? user.greenCredits : 0,
        creditsEarned: totalGreenCredits,
        co2Saved: totalCo2Saved,
        wasteDiverted: totalWasteDiverted,
        itemsReused: totalItemsReused
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
