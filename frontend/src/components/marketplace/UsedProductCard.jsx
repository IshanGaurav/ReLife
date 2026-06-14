import React from 'react';
import { Star, ShieldCheck, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ConditionScoreBadge from '../ui/ConditionScoreBadge';
import { getImageUrl } from '../../utils/imageUtils';

export default function UsedProductCard({ product }) {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  
  const productId = product._id || product.id;
  const isInCart = cartItems.some(item => item.productId === productId || item._id === productId);

  const handleProductClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/relife/product/${productId}`);
  };

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/relife/product/${productId}`)}
    >
      <div className="relative p-6 cursor-pointer" onClick={handleProductClick}>
        <img 
          src={getImageUrl(product.coverImage || product.image)} 
          alt={product.name} 
          className="w-full h-48 object-contain mix-blend-multiply"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[#007185] group-hover:text-[#C7511F] font-medium line-clamp-2 leading-snug">{product.name}</h3>
        
        {/* Seller Info & Condition */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center text-[#FFA41C]">
            {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.sellerRating || 4) ? 'fill-current' : 'text-gray-300 fill-current'}`} />)}
            <span className="text-[#007185] text-xs ml-1 hover:underline">{product.sellerReviews || '1.2K'}</span>
          </div>
        </div>
        <div className="mt-2 w-full">
          <ConditionScoreBadge score={product.conditionScore} />
        </div>

        {/* Pricing */}
        <div className="mt-3 flex items-baseline space-x-2">
          <div className="flex items-start">
            <span className="text-xs mt-1">₹</span>
            <span className="text-2xl font-bold text-[#0F1111]">{String(product.relifePrice).split('.')[0]}</span>
            <span className="text-sm align-top mt-1">{String(product.relifePrice).split('.')[1] ? `.${String(product.relifePrice).split('.')[1]}` : ''}</span>
          </div>
          <span className="text-sm text-[#565959] line-through">₹{product.originalPrice}</span>
        </div>

        {/* Badges / Distance */}
        <div className="mt-auto pt-3 space-y-1.5">
          <div className="flex items-center text-xs text-[#565959] font-medium">
            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
            Ships from {product.distance} away
          </div>
          
          {product.passportAvailable && (
            <div className="flex items-center text-xs text-blue-700 font-bold bg-blue-50 w-fit px-2 py-0.5 rounded border border-blue-100" onClick={(e) => { e.stopPropagation(); navigate(`/relife/passport/${productId}`); }}>
              <ShieldCheck className="w-3 h-3 mr-1" /> Passport Verified
            </div>
          )}
          
          {product.amazonVerified && (
            <div className="flex items-center text-xs text-green-700 font-bold bg-green-50 w-fit px-2 py-0.5 rounded border border-green-100">
              <ShieldCheck className="w-3 h-3 mr-1" /> Amazon Origin Verified
            </div>
          )}

          {product.aiVerified && (
            <div className="flex items-center text-xs text-purple-700 font-bold bg-purple-50 w-fit px-2 py-0.5 rounded border border-purple-100">
              <ShieldCheck className="w-3 h-3 mr-1" /> AI Inspected ({product.healthScore}/100)
            </div>
          )}
        </div>

        {/* Buy Now Button */}
        <button 
          className={`mt-4 w-full rounded-full py-1.5 text-sm font-bold shadow-sm transition-colors flex items-center justify-center ${
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
