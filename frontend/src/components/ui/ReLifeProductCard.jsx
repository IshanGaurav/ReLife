import React from 'react';
import { Star, ShieldCheck, Leaf, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function ReLifeProductCard({ product }) {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  
  const productId = product._id || product.id;
  const isInCart = cartItems.some(item => item.productId === productId || item._id === productId);
  
  const { id, name, originalPrice, relifePrice, sellerRating, sellerReviews, image, conditionScore, distance, passportAvailable, badge } = product;

  return (
    <div 
      className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-shadow relative"
      onClick={() => navigate(`/relife/product/${productId}`)}
    >
      
      {/* ReLife Specific Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm ${badge === 'Open Box' ? 'bg-blue-600 text-white' : 'bg-[#16a34a] text-white'}`}>
            {badge}
          </span>
        )}
        <div className="bg-white text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-sm border border-gray-200 flex items-center shadow-sm">
          Condition: <span className="text-[#FF9900] ml-1">{conditionScore}/100</span>
        </div>
      </div>

      <div className="h-48 bg-gray-50 flex items-center justify-center p-4 relative">
        <img src={image} alt={name} className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
        
        {/* Passport Icon overlay */}
        {passportAvailable && (
          <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow-md border border-gray-100" title="Digital Passport Verified">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-medium text-[#007185] group-hover:text-[#C7511F] line-clamp-2 leading-tight">{name}</p>
        
        <div className="flex items-center text-[#FFA41C] mt-1 mb-1">
          {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(sellerRating || 4.5) ? 'fill-current' : 'text-gray-300 fill-current'}`} />)}
          <ChevronIcon />
          <span className="text-[#007185] text-xs ml-1 hover:underline">{sellerReviews || '1.2K'}</span>
        </div>

        <div className="flex items-end mb-1">
          <span className="text-xs align-top mt-1 font-medium">₹</span>
          <span className="text-2xl font-bold text-[#0F1111]">{(relifePrice || '0').split('.')[0]}</span>
          <span className="text-xs align-top mt-1 font-medium">{(relifePrice || '0').split('.')[1] || '00'}</span>
        </div>
        
        {originalPrice && (
          <span className="text-xs text-[#565959]">
            M.R.P: <span className="line-through">₹{originalPrice}</span>
          </span>
        )}

        {/* Amazon ReLife Info Row */}
        <div className="mt-auto pt-3 border-t border-gray-100 space-y-1 pb-3">
          <div className="flex items-center text-xs text-[#565959]">
            <MapPin className="w-3 h-3 mr-1 text-gray-400" /> Ships from {distance}
          </div>
          <div className="flex items-center text-xs text-[#16a34a] font-medium">
            <Leaf className="w-3 h-3 mr-1" /> Saves ~12kg CO₂
          </div>
        </div>

        <button 
          className={`w-full rounded-full py-1.5 text-xs font-bold shadow-sm transition-colors flex items-center justify-center mb-2 ${
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
  );
}

function ChevronIcon() {
  return (
    <svg className="w-3 h-3 text-[#565959] ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  );
}
