import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('relife_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('relife_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev; // Disable duplicate adds
      
      // Trigger toast
      setToast(`✓ ${product.name} added to cart`);
      setTimeout(() => setToast(null), 3000);

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);
    setCartItems((prev) => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const cartTotal = cartItems.reduce((acc, item) => {
    const priceStr = item.relifePrice || item.price || '0';
    const price = parseFloat(priceStr.toString().replace(/,/g, ''));
    return acc + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-fade-in bg-[#16a34a] text-white px-6 py-3 rounded-md shadow-lg font-bold flex items-center space-x-2">
          <span>{toast}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
