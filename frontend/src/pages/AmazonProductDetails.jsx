import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, ShieldCheck, Truck, Lock, RotateCcw, Recycle, Leaf } from 'lucide-react';
import { amazonProducts, usedProducts, openBoxProducts } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useMode } from '../context/ModeContext';
import ReLifeRecommendationCard from '../components/ui/ReLifeRecommendationCard';
import AIPurchaseAssistant from '../components/ai-purchase-assistant/AIPurchaseAssistant';

export default function AmazonProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { setMode } = useMode();
  const [product, setProduct] = useState(null);
  const [alternative, setAlternative] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const found = amazonProducts.find(p => p.id === id);
    if (found) {
      setProduct(found);
      const isAlreadyInCart = cartItems.some(item => item.id === found.id);
      setAdded(isAlreadyInCart);

      // Recommendation Engine
      const allReLifeProducts = [...openBoxProducts, ...usedProducts];
      let bestMatch = null;
      let highestScore = -1;

      // Parse Amazon price
      const parsePrice = (priceStr) => parseFloat(priceStr.replace(/,/g, ''));
      const amazonPriceNum = parsePrice(found.price);

      // Simple keyword matching for demo
      const searchKeywords = found.name.toLowerCase();
      
      const validMatches = allReLifeProducts.filter(relife => {
        const relifeName = relife.name.toLowerCase();
        let matches = false;
        
        if (searchKeywords.includes('macbook air') && relifeName.includes('macbook air')) matches = true;
        if (searchKeywords.includes('echo dot') && relifeName.includes('echo dot')) matches = true;
        if (searchKeywords.includes('echo dot') && relifeName.includes('echo (4th gen)')) matches = true;
        if (searchKeywords.includes('kindle paperwhite') && relifeName.includes('kindle paperwhite')) matches = true;
        if (searchKeywords.includes('wh-1000xm4') && relifeName.includes('wh-1000xm4')) matches = true;

        if (matches) {
          // Price Filtering: ensure relifePrice < amazonPrice
          const relifePriceNum = parsePrice(relife.relifePrice);
          if (relifePriceNum >= amazonPriceNum) return false;
          return true;
        }
        return false;
      });

      // Find the absolute best unit across all valid base products
      let bestUnitRef = null;
      let highestCondition = -1;
      let bestPriceAdvantage = -1;
      
      validMatches.forEach(relife => {
        if (!relife.availableUnits) return;
        
        relife.availableUnits.forEach(unit => {
          // Parse unit price
          const unitPriceNum = parsePrice(unit.price);
          
          // Price Filtering: ensure unit is cheaper than new Amazon product
          if (unitPriceNum >= amazonPriceNum) return;

          const priceAdvantage = amazonPriceNum - unitPriceNum;
          
          // Generate metrics (using unit.id instead of relife.id)
          const idHash = unit.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          
          const co2SavedNum = relife.co2Saved ? parseInt(relife.co2Saved) : (idHash % 100) + 10;
          const sustainabilityImpact = Math.min(co2SavedNum * 2, 100); 
          
          const lifespanExtensionYears = ((idHash % 50) / 10) + 1; 
          const lifespanExtensionScore = Math.min(lifespanExtensionYears * 20, 100);
          
          const repairability = 60 + (idHash % 40); 
          const logisticsEfficiency = 70 + (idHash % 30); 
          
          const greenScore = Math.round(
            0.25 * unit.conditionScore + 
            0.25 * sustainabilityImpact + 
            0.20 * lifespanExtensionScore + 
            0.15 * repairability + 
            0.15 * logisticsEfficiency
          );

          // Store generated metrics on the unit
          unit.calculatedMetrics = {
            greenScore,
            co2Saved: `${co2SavedNum}kg`,
            lifespanExtension: `+${lifespanExtensionYears.toFixed(1)} Years`
          };

          // Condition-First Ranking Logic
          let isBetter = false;
          if (unit.conditionScore > highestCondition) {
            isBetter = true;
          } else if (unit.conditionScore === highestCondition) {
            if (priceAdvantage > bestPriceAdvantage) {
              isBetter = true;
            }
          }

          if (isBetter) {
            highestCondition = unit.conditionScore;
            bestPriceAdvantage = priceAdvantage;
            bestUnitRef = { product: relife, unit };
          }
        });
      });

      setAlternative(bestUnitRef);
    }
  }, [id, cartItems]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amazon-orange"></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (added) {
      navigate('/cart');
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.oldPrice,
      image: product.image,
      condition: 'New'
    });
    setAdded(true);
  };

  const calculateSavings = (amazonPrice, relifePrice) => {
    try {
      const aPrice = parseFloat(amazonPrice.replace(/,/g, ''));
      const rPrice = parseFloat(relifePrice.replace(/,/g, ''));
      if (aPrice && rPrice) {
        return (aPrice - rPrice).toLocaleString('en-IN');
      }
    } catch(e) {}
    return '0';
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 py-6 bg-white animate-fade-in text-[#0F1111] font-sans">
      {/* Breadcrumb */}
      <div className="text-xs text-[#565959] mb-4 flex items-center space-x-1">
        <span className="hover:underline cursor-pointer">Electronics</span>
        <span>›</span>
        <span className="hover:underline cursor-pointer">Featured Deals</span>
        <span>›</span>
        <span className="text-[#0F1111] font-bold truncate max-w-xs">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Image */}
        <div className="w-full lg:w-[40%] flex flex-col items-center sticky top-4 self-start">
          <div className="w-full h-[500px] flex items-center justify-center p-4">
            <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
          </div>
          <div className="flex space-x-2 mt-4 justify-center">
            <div className="w-12 h-12 border border-amazon-orange rounded cursor-pointer p-1">
              <img src={product.image} className="w-full h-full object-contain" alt="thumbnail 1"/>
            </div>
            <div className="w-12 h-12 border border-[#D5D9D9] rounded cursor-pointer p-1 opacity-60 hover:opacity-100 transition-opacity">
              <img src={product.image} className="w-full h-full object-contain" alt="thumbnail 2"/>
            </div>
          </div>
        </div>

        {/* Center Column: Product Details */}
        <div className="w-full lg:w-[40%] flex flex-col">
          <h1 className="text-2xl font-medium leading-tight mb-2">{product.name}</h1>
          <a href="#" className="text-sm text-[#007185] hover:underline hover:text-[#C7511F] mb-1">Visit the Amazon Store</a>
          
          {/* Ratings */}
          <div className="flex items-center space-x-4 border-b border-[#D5D9D9] pb-3 mb-3">
            <div className="flex items-center text-amazon-orange">
              <span className="text-sm font-bold text-[#0F1111] mr-1">{product.rating}</span>
              {[...Array(Math.floor(product.rating))].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              {product.rating % 1 !== 0 && <Star className="w-4 h-4 fill-current opacity-50" />}
            </div>
            <a href="#" className="text-sm text-[#007185] hover:underline hover:text-[#C7511F]">{product.reviews} ratings</a>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="flex items-start">
              <span className="text-sm font-medium mt-1 mr-1">₹</span>
              <span className="text-[32px] font-medium leading-none">{product.price.split('.')[0]}</span>
              <span className="text-sm font-medium mt-1">{product.price.split('.')[1] ? `.${product.price.split('.')[1]}` : ''}</span>
            </div>
            <div className="text-sm text-[#565959] mt-1">
              List Price: <span className="line-through">₹{product.oldPrice}</span>
            </div>
            <div className="text-sm font-bold text-[#0F1111] mt-2">
              Free Returns
            </div>
          </div>

          {/* Recommendation Widget */}
          {alternative ? (
            <ReLifeRecommendationCard recommendation={alternative} amazonProduct={product} />
          ) : (
            <div className="bg-gray-50 border border-[#D5D9D9] rounded-lg p-5 my-4 text-center">
              <p className="text-[#565959] text-sm">No recommended ReLife alternative currently available.</p>
            </div>
          )}

          {/* AI Purchase Assistant Widget */}
          <AIPurchaseAssistant 
            productId={product.id} 
            brand={product.brand || product.specs?.Brand} 
            category={product.category || 'Electronics'} 
          />

          {/* Specs Table */}
          <div className="mb-6 mt-4">
            <table className="w-full text-sm text-[#0F1111]">
              <tbody>
                {product.specs && Object.entries(product.specs).map(([key, value]) => (
                  <tr key={key}>
                    <td className="py-1 pr-4 font-bold text-[#0F1111] bg-white w-1/3">{key}</td>
                    <td className="py-1 bg-white">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <hr className="border-[#D5D9D9] my-4" />

          {/* About this item */}
          <div>
            <h2 className="text-base font-bold mb-2">About this item</h2>
            <ul className="list-disc pl-5 text-sm space-y-1.5 text-[#0F1111]">
              {product.features && product.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Right Column: Buy Box */}
        <div className="w-full lg:w-[20%]">
          <div className="border border-[#D5D9D9] rounded-lg p-4 sticky top-4">
            <div className="text-2xl font-medium mb-1">
              <span className="text-sm align-top">₹</span>{product.price.split('.')[0]}<span className="text-sm align-top">{product.price.split('.')[1] ? `.${product.price.split('.')[1]}` : ''}</span>
            </div>
            <div className="text-sm font-bold text-[#0F1111] mb-2">Free Returns</div>
            <div className="text-sm text-[#007185] hover:underline cursor-pointer mb-4">FREE delivery <span className="font-bold text-[#0F1111]">Wednesday</span></div>
            <div className="flex items-center text-sm text-[#007185] hover:underline cursor-pointer mb-4 font-medium">
              <MapPin className="w-4 h-4 mr-1 text-[#0F1111]" />
              Deliver to New York 10001
            </div>

            <h3 className="text-lg font-bold text-[#007600] mb-4">In Stock</h3>

            <div className="mb-4">
              <select className="bg-[#F0F2F2] border border-[#D5D9D9] rounded-md px-2 py-1 text-sm w-full outline-none focus:border-amazon-orange focus:shadow-[0_0_0_3px_rgba(228,121,17,0.5)]">
                <option>Qty: 1</option>
                <option>Qty: 2</option>
                <option>Qty: 3</option>
              </select>
            </div>

            <button 
              onClick={handleAddToCart}
              className={`w-full py-2.5 rounded-full mb-2 text-sm font-medium shadow-[0_2px_5px_0_rgba(213,217,217,.5)] transition-all flex items-center justify-center
                ${added 
                  ? 'bg-[#EFFFF3] border border-[#16a34a] hover:bg-[#D5F5DF] text-[#16a34a]' 
                  : 'bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] text-[#0F1111]'}`}
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button className="w-full bg-[#FFA41C] hover:bg-[#FA8900] border border-[#FF8F00] text-[#0F1111] py-2.5 rounded-full text-sm font-medium mb-4 shadow-[0_2px_5px_0_rgba(213,217,217,.5)] transition-all">
              Buy Now
            </button>

            <div className="flex items-center text-[#007185] hover:underline text-sm cursor-pointer mb-4">
              <Lock className="w-4 h-4 mr-2 text-[#565959]" /> Secure transaction
            </div>

            <table className="text-xs text-[#565959] mb-4 w-full">
              <tbody>
                <tr>
                  <td className="pb-1 pr-2">Ships from</td>
                  <td className="pb-1 text-[#0F1111]">Amazon.com</td>
                </tr>
                <tr>
                  <td className="pb-1 pr-2">Sold by</td>
                  <td className="pb-1 text-[#0F1111]">Amazon.com</td>
                </tr>
                <tr>
                  <td className="pb-1 pr-2">Returns</td>
                  <td className="pb-1 text-[#007185] hover:underline cursor-pointer">Eligible for Return</td>
                </tr>
              </tbody>
            </table>

            <hr className="border-[#D5D9D9] mb-4" />
            <button className="w-full border border-[#D5D9D9] bg-white hover:bg-gray-50 text-[#0F1111] py-1.5 rounded-md text-sm shadow-sm transition-all text-left px-3">
              Add to List
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
