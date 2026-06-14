import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCartApi, addToCartApi, removeFromCartApi, updateCartQuantityApi, clearCartApi } from '../api/client';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [toast, setToast] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (user) {
      getCartApi().then(data => {
        if (data && data.success) {
          setCartItems(data.cartItems || []);
        }
      }).catch(err => console.error('Failed to load cart', err));
    } else {
      setCartItems([]);
    }
  }, [user]);

  const addToCart = async (product) => {
    // Check if already in cart using productId or _id
    const productId = product._id || product.id;
    const existing = cartItems.find(item => item.productId === productId || item._id === productId);
    if (existing) return;
    
    // Optimistic UI
    const newItem = {
      productId: productId,
      productType: product.relifePrice ? 'relife' : 'amazon',
      quantity: 1,
      name: product.name,
      price: product.relifePrice ? parseFloat(product.relifePrice.toString().replace(/,/g, '')) : product.price,
      image: product.image
    };
    
    setCartItems(prev => [...prev, newItem]);
    setToast(`✓ ${product.name} added to cart`);
    setTimeout(() => setToast(null), 3000);

    if (user) {
      try {
        await addToCartApi(newItem);
      } catch (error) {
        console.error('Failed to add to cart', error);
      }
    }
  };

  const removeFromCart = async (id) => {
    setCartItems(prev => prev.filter(item => item.productId !== id));
    if (user) {
      try {
        await removeFromCartApi(id);
      } catch (error) {
        console.error('Failed to remove from cart', error);
      }
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);
    
    setCartItems(prev => prev.map(item => 
      item.productId === id ? { ...item, quantity } : item
    ));
    
    if (user) {
      try {
        await updateCartQuantityApi(id, quantity);
      } catch (error) {
        console.error('Failed to update cart quantity', error);
      }
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (user) {
      try {
        await clearCartApi();
      } catch (error) {
        console.error('Failed to clear cart', error);
      }
    }
  };

  const cartCount = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0);

  const cartTotal = (cartItems || []).reduce((acc, item) => {
    console.log('Calculating subtotal:', { cartItems, price: item.price, quantity: item.quantity });
    
    // Safely parse price, stripping commas if it's a string
    let parsedPrice = 0;
    if (typeof item.price === 'string') {
      parsedPrice = parseFloat(item.price.replace(/[^\d.-]/g, ''));
    } else {
      parsedPrice = Number(item.price);
    }
    
    const parsedQuantity = Number(item.quantity) || 1;
    
    const validPrice = isNaN(parsedPrice) ? 0 : parsedPrice;
    
    return acc + (validPrice * parsedQuantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in bg-[#16a34a] text-white px-6 py-3 rounded-md shadow-lg font-bold flex items-center space-x-2">
          <span>{toast}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
