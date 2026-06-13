import { User } from '../models/User.js';

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, cartItems: user.cartItems || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, productType, quantity, name, price, image } = req.body;
    const user = await User.findById(req.user._id);
    
    // Check if item exists
    const existingIndex = user.cartItems.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingIndex >= 0) {
      // Update quantity
      user.cartItems[existingIndex].quantity += (quantity || 1);
    } else {
      // Add new
      user.cartItems.push({
        productId,
        productType: productType || 'relife',
        quantity: quantity || 1,
        name,
        price,
        image
      });
    }

    await user.save();
    res.status(200).json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);
    
    user.cartItems = user.cartItems.filter(
      item => item.productId.toString() !== productId
    );

    await user.save();
    res.status(200).json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);
    
    const item = user.cartItems.find(i => i.productId.toString() === productId);
    if (item) {
      if (quantity <= 0) {
        user.cartItems = user.cartItems.filter(i => i.productId.toString() !== productId);
      } else {
        item.quantity = quantity;
      }
      await user.save();
    }
    
    res.status(200).json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cartItems = [];
    await user.save();
    res.status(200).json({ success: true, cartItems: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
