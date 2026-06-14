import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Recycle } from 'lucide-react';

export default function CrossMarketRecommendation({ recommendationData }) {
  const navigate = useNavigate();

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
  let listingTitle = '';
  let conditionText = '';
  let buttonText = '';

  if (isAmazon) {
    // Current is Amazon, Alternative is ReLife
    if (bestAlternative.isUsed === false) {
      listingTitle = '♻ Open-Box Deal Available';
      conditionText = 'Like New';
      buttonText = 'View ReLife Deal';
    } else {
      listingTitle = '♻ Used Deal Available';
      conditionText = 'Pre-Owned';
      buttonText = 'View ReLife Deal';
    }
  } else {
    // Current is ReLife, Alternative is Amazon New
    listingTitle = '✨ New Product Available';
    conditionText = 'Factory Sealed';
    buttonText = 'View on Amazon';
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

  const currentPrice = currentProduct.price || currentProduct.relifePrice || currentProduct.originalPrice;
  const altPrice = bestAlternative.relifePrice || bestAlternative.price || bestAlternative.originalPrice;
  const savings = calculateSavings(currentPrice, altPrice);
  
  let bestCondScore = '';
  if (isAmazon && bestAlternative.availableUnits?.length > 0) {
    bestCondScore = Math.max(...bestAlternative.availableUnits.map(u => u.conditionScore || 0));
  } else if (!isAmazon && bestAlternative.conditionScore) {
    bestCondScore = bestAlternative.conditionScore;
  }

  const handleNavigate = () => {
    if (isAmazon) {
      navigate(`/relife/product/${targetId}`);
    } else {
      navigate(`/product/${targetId}`);
    }
  };

  return (
    <div className="border border-[#14b8a6] rounded-xl bg-teal-50/30 my-6 shadow-sm overflow-hidden flex flex-col font-sans">
      <div className="bg-teal-500 text-white font-bold px-4 py-2 flex items-center text-sm">
        {listingTitle}
      </div>
      
      <div className="p-5 flex flex-col">
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-500 mb-1">Original Price: <span className="line-through">₹{currentPrice}</span></p>
            <p className="font-bold text-gray-900 text-lg">ReLife Price: ₹{altPrice}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-700 font-medium mb-1">Condition: {conditionText}</p>
            {bestCondScore && (
              <p className="text-teal-700 font-bold">Quality Score: {bestCondScore}/100</p>
            )}
          </div>
        </div>
        
        <div className="bg-green-100 text-green-800 font-bold text-center py-2 rounded-lg mb-4 text-base">
          Save ₹{savings}
        </div>

        <button 
          onClick={handleNavigate}
          className="w-full bg-[#007185] hover:bg-[#005a6a] text-white font-bold py-3 rounded-full transition-colors flex items-center justify-center shadow-sm"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
