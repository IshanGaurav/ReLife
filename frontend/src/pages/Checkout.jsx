import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, CreditCard, Leaf } from 'lucide-react';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [shippingData, setShippingData] = useState({ name: 'Amazon User', address: '123 Main St', city: 'Patna', state: 'Bihar', pin: '800020' });
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (cartItems.length === 0 && step !== 4) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center bg-white border border-[#D5D9D9] mt-8 rounded-sm">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
        <button className="bg-[#FFD814] px-6 py-2 rounded-full font-bold shadow-sm border border-[#FCD200]" onClick={() => navigate('/relife/marketplace')}>Continue Shopping</button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    // Generate mock order and clear cart
    clearCart();
    setStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      {/* Checkout Header */}
      {step < 4 && (
        <h1 className="text-3xl font-medium text-[#0F1111] mb-8 pb-4 border-b border-[#D5D9D9]">Checkout ({cartItems.length} items)</h1>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Steps */}
        <div className="flex-1 space-y-6">
          
          {/* Step 1: Shipping */}
          {step === 4 ? null : (
            <div className={`border rounded-lg p-6 ${step === 1 ? 'border-[#FF9900] shadow-md bg-white' : 'border-[#D5D9D9] bg-[#F7FAFA]'}`}>
              <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => step > 1 && setStep(1)}>
                <h2 className={`text-xl font-bold flex items-center ${step === 1 ? 'text-[#C7511F]' : 'text-[#0F1111]'}`}>
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-sm flex items-center justify-center mr-2">1</span> 
                  Delivery Address
                </h2>
                {step > 1 && <span className="text-[#007185] text-sm hover:underline hover:text-[#C7511F]">Change</span>}
              </div>
              
              {step === 1 ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" value={shippingData.name} onChange={e => setShippingData({...shippingData, name: e.target.value})} className="border p-2 rounded focus:ring-1 focus:ring-[#FF9900] outline-none" />
                    <input type="text" placeholder="Mobile Number" className="border p-2 rounded focus:ring-1 focus:ring-[#FF9900] outline-none" defaultValue="9876543210" />
                  </div>
                  <input type="text" placeholder="Address" value={shippingData.address} onChange={e => setShippingData({...shippingData, address: e.target.value})} className="w-full border p-2 rounded focus:ring-1 focus:ring-[#FF9900] outline-none" />
                  <div className="grid grid-cols-3 gap-4">
                    <input type="text" placeholder="City" value={shippingData.city} onChange={e => setShippingData({...shippingData, city: e.target.value})} className="border p-2 rounded focus:ring-1 focus:ring-[#FF9900] outline-none" />
                    <input type="text" placeholder="State" value={shippingData.state} onChange={e => setShippingData({...shippingData, state: e.target.value})} className="border p-2 rounded focus:ring-1 focus:ring-[#FF9900] outline-none" />
                    <input type="text" placeholder="PIN Code" value={shippingData.pin} onChange={e => setShippingData({...shippingData, pin: e.target.value})} className="border p-2 rounded focus:ring-1 focus:ring-[#FF9900] outline-none" />
                  </div>
                  <button className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg px-6 py-2 font-bold shadow-sm" onClick={() => setStep(2)}>Use this address</button>
                </div>
              ) : (
                <div className="text-sm text-[#0F1111] ml-8">
                  <p className="font-bold">{shippingData.name}</p>
                  <p>{shippingData.address}, {shippingData.city}, {shippingData.state} {shippingData.pin}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 4 ? null : (
            <div className={`border rounded-lg p-6 ${step === 2 ? 'border-[#FF9900] shadow-md bg-white' : 'border-[#D5D9D9] bg-[#F7FAFA]'}`}>
              <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => step > 2 && setStep(2)}>
                <h2 className={`text-xl font-bold flex items-center ${step === 2 ? 'text-[#C7511F]' : 'text-[#0F1111]'}`}>
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-sm flex items-center justify-center mr-2">2</span> 
                  Payment Method
                </h2>
                {step > 2 && <span className="text-[#007185] text-sm hover:underline hover:text-[#C7511F]">Change</span>}
              </div>

              {step === 2 && (
                <div className="space-y-3 animate-fade-in ml-8">
                  <label className="flex items-center space-x-3 cursor-pointer p-2 border rounded border-[#FF9900] bg-orange-50">
                    <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-[#FF9900] focus:ring-[#FF9900]" />
                    <span className="font-bold flex items-center"><CreditCard className="w-5 h-5 mr-2 text-[#0F1111]" /> Credit / Debit Card</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 border border-transparent hover:bg-gray-50">
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-4 h-4 text-[#FF9900] focus:ring-[#FF9900]" />
                    <span>Other UPI Apps</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 border border-transparent hover:bg-gray-50">
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-[#FF9900] focus:ring-[#FF9900]" />
                    <span>Cash on Delivery/Pay on Delivery</span>
                  </label>
                  
                  <div className="pt-4">
                    <button className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg px-6 py-2 font-bold shadow-sm" onClick={() => setStep(3)}>Use this payment method</button>
                  </div>
                </div>
              )}
              {step > 2 && (
                <div className="text-sm text-[#0F1111] ml-8 flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" /> Ending in 4242
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {step === 4 ? null : (
            <div className={`border rounded-lg p-6 ${step === 3 ? 'border-[#FF9900] shadow-md bg-white' : 'border-[#D5D9D9] bg-white opacity-60'}`}>
              <h2 className={`text-xl font-bold flex items-center mb-4 ${step === 3 ? 'text-[#C7511F]' : 'text-[#0F1111]'}`}>
                <span className="w-6 h-6 rounded-full bg-gray-200 text-sm flex items-center justify-center mr-2">3</span> 
                Review items and delivery
              </h2>

              {step === 3 && (
                <div className="ml-8 border border-[#D5D9D9] rounded p-4">
                  <h3 className="font-bold text-[#16a34a] mb-4 text-lg">Guaranteed Delivery: Tomorrow</h3>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain mix-blend-multiply mr-4" />
                        <div>
                          <p className="font-bold text-[#0F1111]">{item.name}</p>
                          <p className="text-[#CC0C39] font-bold">₹{item.relifePrice || item.price}</p>
                          <p className="text-xs text-[#565959]">Condition: {item.conditionScore || 90}/100 • Sold by ReLife Verified Seller</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 border-t border-[#D5D9D9] pt-4 flex items-center justify-between">
                    <button className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg px-8 py-3 font-bold shadow-sm text-lg" onClick={handlePlaceOrder}>Place Your Order</button>
                    <p className="text-[#CC0C39] font-bold text-xl">Order Total: ₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="bg-white border border-[#D5D9D9] rounded-lg p-12 text-center shadow-lg animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF9900] to-[#16a34a]"></div>
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-[#0F1111] mb-2">Order placed, thank you!</h1>
              <p className="text-[#565959] text-lg mb-8">Confirmation will be sent to your email.</p>
              
              <div className="bg-[#F7FAFA] border border-[#D5D9D9] rounded-lg p-6 max-w-lg mx-auto mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Leaf className="w-8 h-8 text-[#16a34a] mr-2" />
                  <h3 className="text-xl font-bold text-[#16a34a]">Sustainability Impact</h3>
                </div>
                <p className="text-[#0F1111] font-bold text-lg mb-1">+450 Green Credits Earned</p>
                <p className="text-[#565959] text-sm">You successfully rescued products from e-waste and helped offset 120kg of CO₂.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-full px-6 py-2 font-bold shadow-sm" onClick={() => navigate('/relife/marketplace')}>Continue Shopping</button>
                <button className="bg-[#FF9900] hover:bg-[#e38800] border border-[#F3A847] rounded-full px-6 py-2 font-bold text-black shadow-sm" onClick={() => navigate('/relife')}>Return to ReLife Home</button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order Summary Sidebar */}
        {step < 4 && (
          <div className="w-full md:w-[320px] bg-white border border-[#D5D9D9] rounded-lg p-4 h-fit sticky top-24 shadow-sm">
            <button 
              className={`w-full rounded-full py-2 font-bold shadow-sm mb-4 transition-colors ${step === 3 ? 'bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200]' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}`}
              onClick={step === 3 ? handlePlaceOrder : undefined}
            >
              Place Your Order
            </button>
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm border-b border-[#D5D9D9] pb-4 mb-4 text-[#0F1111]">
              <div className="flex justify-between"><span>Items:</span> <span>₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
              <div className="flex justify-between"><span>Delivery:</span> <span>₹40.00</span></div>
              <div className="flex justify-between"><span>Promotion Applied:</span> <span className="text-[#CC0C39]">-₹40.00</span></div>
              <div className="flex justify-between"><span>Total:</span> <span>₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#CC0C39] text-xl">Order Total:</span>
              <span className="font-bold text-[#CC0C39] text-xl">₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="mt-6 bg-[#EFFFF3] border border-[#B8E2C4] rounded p-3">
              <p className="text-xs font-bold text-[#16a34a] flex items-center mb-1"><Leaf className="w-3 h-3 mr-1" /> Expected Impact</p>
              <p className="text-xs text-[#0F1111]">Earning up to 450 Green Credits upon delivery completion.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
