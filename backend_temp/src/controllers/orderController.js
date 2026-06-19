import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { RelifeProduct } from '../models/RelifeProduct.js';
import { GreenCreditTransaction } from '../models/GreenCreditTransaction.js';
import { Notification } from '../models/Notification.js';
import { ProductPassport } from '../models/ProductPassport.js';
import { AmazonProduct } from '../models/AmazonProduct.js';

export const checkout = async (req, res) => {
  const lockedRelifeProducts = [];
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

    // 1. ATOMIC LOCKING PHASE
    for (const item of cartItems) {
      let isRelife = item.productType === 'relife' || item.productType === 'RelifeProduct';
      const pId = item.productId || item._id;

      if (isRelife) {
        // Safety check: Fix misclassified Amazon products (e.g. from frontend originalId mismatch)
        let filterForAmazon = { originalId: pId };
        if (String(pId).match(/^[0-9a-fA-F]{24}$/)) {
          filterForAmazon = { $or: [{ _id: pId }, { originalId: pId }] };
        }
        const isActuallyAmazon = await AmazonProduct.findOne(filterForAmazon);
        if (isActuallyAmazon) {
          isRelife = false;
          item.productType = 'amazon'; // Fix in memory to bypass Relife phases
        }
      }

      if (isRelife) {
        const filter = { status: 'ACTIVE' };
        if (String(pId).match(/^[0-9a-fA-F]{24}$/)) {
          filter.$or = [
            { _id: pId },
            { 'availableUnits._id': pId }
          ];
        } else {
          filter.$or = [
            { originalId: pId },
            { 'availableUnits.unitId': pId }
          ];
        }

        // Atomically lock the product
        const lockedProduct = await RelifeProduct.findOneAndUpdate(
          filter,
          { $set: { status: 'SOLD', soldAt: new Date(), buyerId: req.user._id } },
          { new: true }
        );

        if (!lockedProduct) {
          throw new Error(`PRODUCT_ALREADY_SOLD:${item.name || 'Unknown Product'}`);
        }
        lockedRelifeProducts.push(lockedProduct);
      }
    }

    // 2. DATA AGGREGATION PHASE
    for (const item of cartItems) {
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
        dbProduct = lockedRelifeProducts.find(p => 
          p._id.toString() === pId.toString() || 
          p.originalId === pId ||
          (p.availableUnits && p.availableUnits.some(u => 
            u._id?.toString() === pId.toString() || 
            u.unitId === pId
          ))
        );
        
        creditsEarned = Math.floor(price / 100) * (item.quantity || 1);
        totalGreenCredits += creditsEarned;
        totalItemsReused += (item.quantity || 1);
        
        if (dbProduct.co2Saved) {
          const co2 = parseFloat(dbProduct.co2Saved.replace(/[^\d.-]/g, ''));
          itemCo2Saved = !isNaN(co2) ? co2 : 45;
        } else {
          itemCo2Saved = 45;
        }
        totalCo2Saved += itemCo2Saved * (item.quantity || 1);
        conditionScore = dbProduct.conditionScore || 90;
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

    // 3. ORDER CREATION PHASE
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

    // 4. LEDGER, PASSPORT, NOTIFICATIONS
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
        
        const dbProductToUpdate = lockedRelifeProducts.find(p => p._id.toString() === item.productId.toString() || p.originalId === item.productId);
        
        if (dbProductToUpdate) {
          dbProductToUpdate.transactionId = order._id;
          await dbProductToUpdate.save();
          
          const passport = await ProductPassport.findOne({ productId: dbProductToUpdate._id });
          if (passport) {
            passport.ownershipHistory.push({
              userId: req.user._id,
              name: req.user.name,
              from: new Date()
            });
            await passport.save();
          }

          if (dbProductToUpdate.listingOwnerId) {
            const seller = await User.findById(dbProductToUpdate.listingOwnerId);
            if (seller) {
              seller.soldCount = (seller.soldCount || 0) + 1;
              await seller.save();
              await Notification.create({
                userId: seller._id,
                title: 'Product Sold',
                message: `Your listing '${dbProductToUpdate.name}' has been purchased successfully.`,
                type: 'SALE',
                relatedItemId: dbProductToUpdate._id
              });
            }
          }

          if (dbProductToUpdate.sourceOrderId && dbProductToUpdate.sourceItemId) {
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
    }

    // 5. UPDATE BUYER METRICS
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
    // 6. ROLLBACK LOGIC
    if (lockedRelifeProducts.length > 0) {
      try {
        for (const lockedItem of lockedRelifeProducts) {
          await RelifeProduct.findByIdAndUpdate(lockedItem._id, {
            $set: { status: 'ACTIVE' },
            $unset: { soldAt: "", buyerId: "", transactionId: "" }
          });
        }
      } catch (rollbackError) {
        console.error('CRITICAL ROLLBACK FAILURE:', rollbackError);
      }
    }
    
    if (error.message.startsWith('PRODUCT_ALREADY_SOLD:')) {
      const productName = error.message.split(':')[1];
      return res.status(400).json({ message: `Sorry, ${productName} is no longer available.` });
    }

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
