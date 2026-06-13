import React from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ConditionScoreBadge from '../ui/ConditionScoreBadge';

export default function OpenBoxCard({ product }) {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();

  const isInCart = cartItems.some(item => item.id === product.id);

  return (
    <div 
      className="bg-white rounded-lg border border-[#D5D9D9] flex flex-col group cursor-pointer hover:shadow-xl transition-shadow relative overflow-hidden"
      onClick={() => navigate(`/relife/product/${product.id}`)}
    >
      {/* Premium Amazon Certified Open Box Badge */}
      <div className="bg-[#111111] text-white flex items-center px-3 py-1.5 shadow-sm relative z-10 border-b-2 border-[#FF9900]">
        <CheckCircle className="w-4 h-4 text-[#16a34a] mr-1.5" />
        <span className="text-xs font-extrabold tracking-wide text-[#FF9900]">AMAZON CERTIFIED</span>
        <span className="text-xs font-bold ml-1">OPEN BOX</span>
      </div>

      <div className="h-56 bg-gray-50 flex items-center justify-center p-6 relative">
        <img src={product.image} alt={product.name} className="max-h-full object-contain group-hover:scale-105 transition-transform mix-blend-multiply" />
        {/* Discount Badge */}
        <div className="absolute top-3 right-3 bg-[#CC0C39] text-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">
          {product.discountPercent}% OFF
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[#007185] group-hover:text-[#C7511F] font-medium line-clamp-2 leading-snug">{product.name}</h3>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex-1 mr-2">
            <ConditionScoreBadge score={product.conditionScore} />
          </div>
          {product.aiVerified && (
            <div className="text-[10px] font-bold text-[#007185] flex items-center bg-white px-1.5 py-1 rounded border border-[#D5D9D9]">
              <ShieldCheck className="w-3 h-3 mr-0.5" /> AI Verified
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="mt-4 flex items-baseline space-x-2">
          <div className="flex items-start">
            <span className="text-xs mt-1 text-[#CC0C39]">₹</span>
            <span className="text-2xl font-bold text-[#CC0C39]">{product.relifePrice.split('.')[0]}</span>
          </div>
          <span className="text-xs text-[#565959]">M.R.P: <span className="line-through">₹{product.originalPrice}</span></span>
        </div>

        <div className="mt-auto pt-4">
          <button 
            className={`w-full rounded-full py-1.5 text-sm font-bold shadow-sm transition-colors flex items-center justify-center ${
              isInCart 
                ? 'bg-[#16a34a] text-white hover:bg-green-700 border-transparent' 
                : 'bg-[#FFD814] hover:bg-[#F7CA00] border-[#FCD200]'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isInCart) {
                navigate('/cart');
              } else {
                addToCart(product);
              }
            }}
          >
            {isInCart ? '✓ Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
