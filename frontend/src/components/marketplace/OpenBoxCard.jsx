import React from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ConditionScoreBadge from '../ui/ConditionScoreBadge';
import { getImageUrl } from '../../utils/imageUtils';

export default function OpenBoxCard({ product }) {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useCart();
  
  const productId = product._id || product.id;
  const isInCart = cartItems.some(item => item.productId === productId || item._id === productId);

  const handleProductClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/relife/product/${productId}`);
  };

  const getDiscountPercent = () => {
    if (product.discountPercent) return product.discountPercent;
    try {
      const orig = parseFloat(String(product.originalPrice).replace(/,/g, ''));
      const relife = parseFloat(String(product.relifePrice).replace(/,/g, ''));
      if (orig && relife && orig > relife) {
        return Math.round(((orig - relife) / orig) * 100);
      }
    } catch(e) {}
    return 0;
  };

  const getConditionScore = () => {
    if (product.conditionScore) return product.conditionScore;
    if (product.availableUnits && product.availableUnits.length > 0) {
      return Math.max(...product.availableUnits.map(u => u.conditionScore || 0));
    }
    return 0;
  };

  const discount = getDiscountPercent();
  const score = getConditionScore();

  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col h-full"
      onClick={handleProductClick}
    >
      {/* Premium Amazon Certified Open Box Badge */}
      <div className="bg-[#111111] text-white flex items-center px-3 py-1.5 shadow-sm relative z-10 border-b-2 border-[#FF9900]">
        <CheckCircle className="w-4 h-4 text-[#16a34a] mr-1.5" />
        <span className="text-xs font-extrabold tracking-wide text-[#FF9900]">AMAZON CERTIFIED</span>
        <span className="text-xs font-bold ml-1">OPEN BOX</span>
      </div>

      <div className="h-56 bg-gray-50 flex items-center justify-center p-6 relative">
        <img src={getImageUrl(product.coverImage || product.image)} alt={product.name} className="max-h-full object-contain group-hover:scale-105 transition-transform mix-blend-multiply" />
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-[#CC0C39] text-white text-xs font-bold px-2 py-1 rounded-sm shadow-sm">
            {discount}% OFF
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[#007185] group-hover:text-[#C7511F] font-medium line-clamp-2 leading-snug">{product.name}</h3>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex-1 mr-2">
            <ConditionScoreBadge score={score} />
          </div>
          {product.aiVerified && (
            <div className="text-[10px] font-bold text-[#007185] flex items-center bg-white px-1.5 py-1 rounded border border-[#D5D9D9]">
              <ShieldCheck className="w-3 h-3 mr-0.5" /> AI Verified ({product.healthScore || score}/100)
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="mt-4 flex items-baseline space-x-2">
          <div className="flex items-start">
            <span className="text-xs mt-1 text-[#CC0C39]">₹</span>
            <span className="text-2xl font-bold text-[#CC0C39]">{String(product.relifePrice).split('.')[0]}</span>
            <span className="text-sm align-top mt-1">{String(product.relifePrice).split('.')[1] ? `.${String(product.relifePrice).split('.')[1]}` : ''}</span>
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
