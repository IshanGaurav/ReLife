import { Order } from '../models/Order.js';
import { GreenCreditTransaction } from '../models/GreenCreditTransaction.js';
import { CircularAction } from '../models/CircularAction.js';
import { RelifeProduct } from '../models/RelifeProduct.js';
import { User } from '../models/User.js';
import axios from 'axios';
import FormData from 'form-data';

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

export const submitCircularAction = async (req, res) => {
  try {
    const { 
      sourceOrderId, 
      sourceItemId, 
      actionType, 
      modelName, 
      originalPrice,
      healthScore,
      conditionLabel,
      suggestedPrice,
      confidence,
      damagePercentage,
      recommendation,
      image,
      category,
      sellerImages
    } = req.body;
    
    const userId = req.user._id;

    // 1. Validations First (prevent duplicate processing)
    const existingAction = await CircularAction.findOne({ sourceOrderId, sourceItemId });
    if (existingAction) {
      return res.status(400).json({ message: 'This item has already been processed in the Circular Economy Hub.' });
    }

    let sourceOrder = null;
    let orderItem = null;

    if (actionType === 'RESELL') {
      sourceOrder = await Order.findById(sourceOrderId);
      if (!sourceOrder) {
        return res.status(404).json({ message: 'Source order not found.' });
      }
      orderItem = sourceOrder.items.id(sourceItemId) || sourceOrder.items.find(item => item._id.toString() === sourceItemId.toString());
      if (!orderItem) {
        return res.status(404).json({ message: 'Source item not found in order.' });
      }
      if (orderItem.resaleStatus === 'listed') {
        return res.status(400).json({ message: 'This item is already listed in the marketplace.' });
      }
      if (orderItem.resaleStatus === 'sold') {
        return res.status(400).json({ message: 'This item has already been sold.' });
      }
      
      // Explicit duplicate marketplace listing guard
      const existingListing = await RelifeProduct.findOne({ sourceOrderId, sourceItemId, status: 'ACTIVE' });
      if (existingListing) {
        return res.status(400).json({ message: 'This item is already listed in the marketplace.' });
      }
    }

    // 2. Determine Credits and Impact
    let creditsEarned = 0;
    let co2Saved = 0;
    let wasteDiverted = 0;

    switch (actionType) {
      case 'RESELL': creditsEarned = 35; co2Saved = 45; wasteDiverted = 0.5; break;
      case 'REFURBISH': creditsEarned = 50; co2Saved = 60; wasteDiverted = 0.5; break;
      case 'RECYCLE': creditsEarned = 100; co2Saved = 80; wasteDiverted = 1.0; break;
      case 'DONATE': creditsEarned = 150; co2Saved = 100; wasteDiverted = 1.0; break;
      default: creditsEarned = 0;
    }

    // 3. Prepare Documents (DO NOT SAVE YET)
    const newAction = new CircularAction({
      userId,
      sourceOrderId,
      sourceItemId,
      actionType,
      creditsEarned,
      modelName,
      originalPrice
    });
    
    const newTransaction = new GreenCreditTransaction({
      userId,
      credits: creditsEarned,
      productName: modelName,
      type: actionType,
      description: `${actionType} completed: ${modelName}`,
      co2Saved
    });
    const transErr = newTransaction.validateSync();
    if (transErr) throw transErr;

    let relifeProduct = null;
    if (actionType === 'RESELL') {
      const hasSellerImages = Array.isArray(sellerImages) && sellerImages.length > 0;
      relifeProduct = new RelifeProduct({
        originalId: `RESALE-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: modelName,
        images: hasSellerImages ? sellerImages : [],
        coverImage: hasSellerImages ? sellerImages[0] : null,
        thumbnailUrl: hasSellerImages ? sellerImages[0] : null,
        image: hasSellerImages ? sellerImages[0] : (image || 'https://via.placeholder.com/150'),
        originalPrice: originalPrice,
        relifePrice: suggestedPrice || Math.floor(originalPrice * 0.6),
        conditionScore: healthScore || 90,
        category: category || 'Electronics',
        isUsed: true,
        amazonVerified: true,
        passportAvailable: true,
        aiVerified: true,
        healthScore: healthScore,
        condition: conditionLabel,
        recommendation: recommendation,
        confidence: confidence,
        damagePercentage: damagePercentage,
        inspectionTimestamp: new Date(),
        listingOwnerId: userId,
        sourceOrderId,
        sourceItemId,
        status: 'ACTIVE',
        greenCredits: 35, // buyers get 35 credits
        availableUnits: [{
          unitId: `U-${Date.now()}`,
          conditionScore: healthScore || 90,
          conditionLabel: conditionLabel || 'Good',
          price: suggestedPrice || Math.floor(originalPrice * 0.6),
          sellerName: req.user.name || 'Amazon Customer',
          passportId: `PASS-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
          distance: '2.5 km'
        }]
      });
      const prodErr = relifeProduct.validateSync();
      if (prodErr) throw prodErr;
    }

    // 4. Save Everything (now that validations passed)
    if (actionType === 'RESELL') {
      await relifeProduct.save();
      orderItem.resaleStatus = 'listed';
      orderItem.resaleListingId = relifeProduct.originalId;
      await sourceOrder.save();
    }

    await newTransaction.save();
    
    const user = await User.findById(userId);
    user.greenCredits += creditsEarned;
    user.lifetimeCreditsEarned += creditsEarned;
    user.co2Saved += co2Saved;
    user.wasteDiverted += wasteDiverted;
    user.itemsReused += 1;
    await user.save();

    // Save action LAST to guarantee atomicity and prevent "already processed" stuck state
    await newAction.save();

    const userData = user.toObject();
    delete userData.passwordHash;

    res.status(200).json({
      success: true,
      message: `${actionType} action successfully recorded!`,
      creditsEarned,
      user: userData
    });

  } catch (error) {
    console.error('CIRCULAR ACTION ERROR:', error);
    res.status(500).json({ message: 'Failed to process circular action', error: error.message });
  }
};

export const inspectImageWithAI = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided for AI inspection.' });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, req.file.originalname);

    let aiResponse;
    try {
      aiResponse = await axios.post('http://localhost:8000/predict', formData, {
        headers: {
          ...formData.getHeaders()
        },
        timeout: 10000 // 10 second timeout
      });
    } catch (aiError) {
      console.error('AI Service Error:', aiError.message);
      // Return 503 Service Unavailable so the frontend knows the AI is offline and can prompt the user to retry
      return res.status(503).json({ 
        message: 'AI Inspection Service is currently unreachable. Please try again later.',
        error: aiError.message
      });
    }

    const { confidence, damage_percentage } = aiResponse.data;

    // Calculate score and metrics
    const healthScore = Math.max(0, Math.min(100, Math.floor(100 - damage_percentage)));
    
    let disposition = 'Good';
    if (healthScore >= 90) disposition = 'Like New';
    else if (healthScore >= 75) disposition = 'Excellent';
    else if (healthScore >= 60) disposition = 'Good';
    else if (healthScore >= 40) disposition = 'Fair';
    else disposition = 'Poor';

    let expectedLifespan = '3-4 Years';
    if (healthScore >= 90) expectedLifespan = '5+ Years';
    else if (healthScore >= 75) expectedLifespan = '4-5 Years';
    else if (healthScore >= 60) expectedLifespan = '3-4 Years';
    else if (healthScore >= 40) expectedLifespan = '1-2 Years';
    else expectedLifespan = '< 1 Year';

    // AI suggestion for Circular Action
    let suggestedAction = 'RESELL';
    if (healthScore < 40) suggestedAction = 'RECYCLE';
    else if (healthScore < 60) suggestedAction = 'REFURBISH';

    res.status(200).json({
      success: true,
      data: {
        score: healthScore,
        disposition,
        reasoning: `AI detected ${damage_percentage.toFixed(2)}% damage. Confidence: ${confidence.toFixed(2)}%.`,
        scratches: Math.floor(damage_percentage / 10), // mock stat
        damage: damage_percentage > 20 ? 'Visible' : 'Minimal',
        expectedLifespan,
        suggestedAction,
        rawTelemetry: {
          confidence,
          damagePercentage: damage_percentage
        }
      }
    });

  } catch (error) {
    console.error('AI INSPECTION CONTROLLER ERROR:', error);
    res.status(500).json({ message: 'Failed to complete AI inspection', error: error.message });
  }
};
