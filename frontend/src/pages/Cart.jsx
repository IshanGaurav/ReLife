import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-8 bg-white border border-[#D5D9D9] text-center rounded-sm mt-8 animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Your Amazon ReLife Cart is empty.</h2>
        <p className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer" onClick={() => navigate('/relife/marketplace')}>
          Continue shopping on the Marketplace
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 mt-4 animate-fade-in">
      {/* Left: Cart Items */}
      <div className="flex-1 bg-white p-6 border border-[#D5D9D9] rounded-sm">
        <h1 className="text-3xl font-medium text-[#0F1111] mb-1">Shopping Cart</h1>
        <p className="text-sm text-[#007185] hover:text-[#C7511F] cursor-pointer hover:underline mb-4">Deselect all items</p>
        <div className="text-right text-sm text-[#565959] border-b border-[#D5D9D9] pb-2">Price</div>

        <div className="flex flex-col space-y-6 pt-4">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex border-b border-[#D5D9D9] pb-6 relative">
              <div className="w-40 flex-shrink-0 cursor-pointer" onClick={() => navigate(`/relife/product/${item.productId}`)}>
                <img src={item.image} alt={item.name} className="w-full h-32 object-contain mix-blend-multiply" />
              </div>
              
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer leading-snug line-clamp-2 pr-24" onClick={() => navigate(`/relife/product/${item.productId}`)}>
                  {item.name}
                </h3>
                <p className="text-sm text-[#16a34a] font-bold mt-1">In stock</p>
                <p className="text-xs text-[#565959] mt-1">Eligible for FREE Shipping</p>
                <div className="text-xs font-bold text-[#0F1111] mt-1 flex items-center">
                  Condition Score: <span className="text-[#C7511F] ml-1">{item.conditionScore || 'N/A'}/100</span>
                </div>
                
                <div className="flex items-center mt-4 space-x-4">
                  <div className="flex items-center border border-[#D5D9D9] rounded-md shadow-sm bg-[#F0F2F2] overflow-hidden">
                    <button className="px-3 py-1 hover:bg-[#E3E6E6]" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                    <span className="px-3 py-1 bg-white border-l border-r border-[#D5D9D9] text-sm font-bold">{item.quantity}</span>
                    <button className="px-3 py-1 hover:bg-[#E3E6E6]" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                  </div>
                  
                  <div className="border-l border-gray-300 h-4"></div>
                  <button className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline" onClick={() => removeFromCart(item.productId)}>Delete</button>
                  
                  <div className="border-l border-gray-300 h-4"></div>
                  <button className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">Save for later</button>
                </div>
              </div>

              <div className="absolute right-0 top-0">
                <span className="text-lg font-bold text-[#0F1111]">₹{item.relifePrice || item.price}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-right mt-4">
          <p className="text-lg">Subtotal ({cartCount} items): <span className="font-bold">₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></p>
        </div>
      </div>

      {/* Right: Checkout Panel */}
      <div className="w-full lg:w-[300px] h-fit">
        {/* Amazon Protect / Buy Back ad */}
        <div className="bg-white p-4 border border-[#D5D9D9] rounded-sm mb-4">
          <div className="flex items-center text-sm text-[#16a34a] font-bold mb-2">
            <CheckCircle className="w-4 h-4 mr-1" /> Your order is eligible for FREE Delivery.
          </div>
          <p className="text-xs text-[#565959]">Select this option at checkout. Details</p>
        </div>

        <div className="bg-white p-4 border border-[#D5D9D9] rounded-sm">
          <p className="text-lg mb-4">Subtotal ({cartCount} items): <span className="font-bold">₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></p>
          <button 
            className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-2 text-sm font-bold shadow-sm"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Buy
          </button>
          
          <div className="mt-4 border-t border-[#D5D9D9] pt-4">
            <div className="bg-[#EFFFF3] border border-[#B8E2C4] rounded-lg p-3 text-xs text-[#0F1111]">
              <span className="font-bold text-[#16a34a]">ReLife Impact:</span> By checking out, you're preventing roughly 120kg of e-waste and earning up to 500 Green Credits!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
