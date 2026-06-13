import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, ShieldCheck, Tag, CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useMode } from '../../context/ModeContext';

export default function CrossMarketRecommendation({ recommendationData }) {
  const navigate = useNavigate();
  const { setMode } = useMode();

  if (!recommendationData) return null;

  const { isAmazon, similarProducts, currentProduct } = recommendationData;

  if (!similarProducts || similarProducts.length === 0) {
    return (
      <div className="bg-gray-50 border border-[#D5D9D9] rounded-lg p-5 my-4 text-center">
        <p className="text-[#565959] text-sm font-medium">No equivalent product found in the other marketplace.</p>
      </div>
    );
  }

  const bestAlternative = similarProducts[0];
  const targetId = bestAlternative._id || bestAlternative.id;
  
  // Determine Listing Type
  let listingType = '';
  let badgeColor = '';
  let badgeIcon = null;
  let subtitle = '';
  let marketplaceName = '';

  if (isAmazon) {
    // Current is Amazon, Alternative is ReLife
    if (bestAlternative.isUsed === false) {
      listingType = 'OPEN BOX DEAL';
      badgeColor = 'blue';
      badgeIcon = <Package className="w-4 h-4 mr-1.5" />;
      subtitle = 'Like New';
      marketplaceName = 'Available on Amazon ReLife';
    } else {
      listingType = 'USED MARKETPLACE';
      badgeColor = 'green';
      badgeIcon = <Leaf className="w-4 h-4 mr-1.5" />;
      subtitle = 'Pre-Owned Product';
      marketplaceName = 'Available on Amazon ReLife Marketplace';
    }
  } else {
    // Current is ReLife, Alternative is Amazon New
    listingType = 'NEW PRODUCT';
    badgeColor = 'amber';
    badgeIcon = <CheckCircle className="w-4 h-4 mr-1.5" />;
    subtitle = 'Factory Sealed';
    marketplaceName = 'Available New on Amazon';
  }

  const calculateSavings = (price1, price2) => {
    try {
      const p1 = parseFloat(String(price1).replace(/,/g, ''));
      const p2 = parseFloat(String(price2).replace(/,/g, ''));
      if (!isNaN(p1) && !isNaN(p2)) {
        return Math.abs(p1 - p2).toLocaleString('en-IN');
      }
    } catch(e) {}
    return '0';
  };

  const currentPrice = currentProduct.price || currentProduct.relifePrice;
  const altPrice = bestAlternative.relifePrice || bestAlternative.price;
  const savings = calculateSavings(currentPrice, altPrice);
  
  let bestCondScore = '';
  if (isAmazon && bestAlternative.availableUnits?.length > 0) {
    bestCondScore = Math.max(...bestAlternative.availableUnits.map(u => u.conditionScore || 0));
  } else if (!isAmazon && bestAlternative.conditionScore) {
    bestCondScore = bestAlternative.conditionScore; // although alternative is Amazon New, Amazon new doesn't have score
  }

  const themeClasses = {
    blue: {
      border: 'border-blue-500',
      bg: 'bg-blue-50',
      headerBg: 'bg-blue-600',
      text: 'text-blue-700'
    },
    green: {
      border: 'border-green-500',
      bg: 'bg-green-50',
      headerBg: 'bg-green-600',
      text: 'text-green-700'
    },
    purple: {
      border: 'border-purple-500',
      bg: 'bg-purple-50',
      headerBg: 'bg-purple-600',
      text: 'text-purple-700'
    },
    amber: {
      border: 'border-amber-500',
      bg: 'bg-amber-50',
      headerBg: 'bg-amber-500',
      text: 'text-amber-700'
    }
  };

  const theme = themeClasses[badgeColor] || themeClasses.green;

  const handleNavigate = () => {
    if (isAmazon) {
      if (bestAlternative.isUsed === false) {
        navigate(`/relife/product/${targetId}`);
      } else {
        navigate(`/relife/product/${targetId}`);
      }
    } else {
      navigate(`/product/${targetId}`);
    }
  };

  return (
    <div className={`border-2 ${theme.border} rounded-lg ${theme.bg} my-4 shadow-sm relative overflow-hidden flex flex-col`}>
      {/* Header Badge */}
      <div className={`${theme.headerBg} text-white font-black px-4 py-2 flex items-center justify-between`}>
        <div className="flex items-center tracking-wider text-sm">
          {badgeIcon}
          {listingType}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-[#0F1111] text-md leading-tight mb-1">
          {marketplaceName}
        </h3>
        <p className={`text-sm font-semibold ${theme.text} mb-3`}>
          {subtitle} {isAmazon && bestAlternative.passportAvailable && "• Verified with Digital Passport"}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 bg-white p-3 rounded border border-gray-200 shadow-sm">
          <div className="w-20 h-20 bg-white flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
            <img src={bestAlternative.image} alt={bestAlternative.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="text-sm font-medium text-amazon-blue line-clamp-2" title={bestAlternative.name}>
              {bestAlternative.name}
            </p>
            
            {isAmazon && bestCondScore && (
              <p className="text-xs font-bold text-gray-600 mt-1">
                Condition: {bestCondScore}/100
              </p>
            )}

            <div className="mt-2 text-sm text-[#565959]">
              <span>{isAmazon ? 'Amazon Price:' : 'ReLife Price:'} ₹{currentPrice}</span>
              <br/>
              <span className="font-bold text-[#0F1111]">
                {isAmazon ? (bestAlternative.isUsed === false ? 'ReLife Price:' : 'Marketplace Price:') : 'Amazon Price:'} ₹{altPrice}
              </span>
            </div>
            
            <div className="mt-2 inline-flex items-center text-sm font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded w-max">
              You Save: ₹{savings}
            </div>
          </div>
        </div>

        <button 
          onClick={handleNavigate}
          className="w-full mt-4 bg-white border border-gray-300 hover:bg-gray-50 font-bold text-sm py-2 px-4 rounded-full shadow-sm text-amazon-blue flex items-center justify-center transition-colors"
        >
          View {isAmazon ? (bestAlternative.isUsed === false ? 'Open Box Deal' : 'Used Product') : 'New Product'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}
