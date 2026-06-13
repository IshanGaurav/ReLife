import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, MapPin, Leaf, CheckCircle, ChevronRight, Star, Clock, Wrench, User, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useMode } from '../context/ModeContext';
import { getRelifeProduct } from '../api/client';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, addToCart } = useCart();
  const { mode, setMode } = useMode();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUsed, setIsUsed] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const unitsSectionRef = useRef(null);

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

  if (!id || id === 'undefined') {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-4">The product you are looking for does not exist or the link is broken.</p>
        <button onClick={() => navigate('/')} className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-6 py-2 rounded-full font-medium shadow-sm">
          Return Home
        </button>
      </div>
    );
  }


  useEffect(() => {
    getRelifeProduct(id)
      .then(foundProduct => {
         if (foundProduct) {
            setProduct(foundProduct);
            setIsUsed(foundProduct.isUsed);
            
            let initialUnit = null;
            if (location.state?.recommendedUnitId && foundProduct.availableUnits) {
              initialUnit = foundProduct.availableUnits.find(u => u.unitId === location.state.recommendedUnitId);
            }
            if (!initialUnit && foundProduct.availableUnits?.length > 0) {
              initialUnit = foundProduct.availableUnits.reduce((best, curr) => (curr.conditionScore > best.conditionScore ? curr : best), foundProduct.availableUnits[0]);
            }
            if (initialUnit) setSelectedUnit(initialUnit);
         }
         setLoading(false);
      })
      .catch(err => {
         console.error('Failed to load product', err);
         setLoading(false);
      });
  }, [id, location.state]);

  useEffect(() => {
    if (location.state?.recommendedUnitId && unitsSectionRef.current && (selectedUnit?.unitId || selectedUnit?._id || selectedUnit?.id) === location.state.recommendedUnitId) {
      setTimeout(() => {
        unitsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [location.state, selectedUnit]);

  if (!product || !selectedUnit) return <div className="p-12 text-center font-bold">Product not found.</div>;

  return (
    <div className="max-w-7xl mx-auto bg-white p-4 sm:p-6 lg:p-8 animate-fade-in border border-[#D5D9D9] rounded-sm mt-4">
      
      {/* Breadcrumbs */}
      <div className="text-xs text-[#565959] mb-4 flex items-center space-x-1">
        <Link to="/relife/marketplace" className="hover:underline">Amazon ReLife Marketplace</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:underline cursor-pointer">{product.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#C7511F] truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left: Image Gallery */}
        <div className="md:col-span-4 flex flex-col">
          <div className="sticky top-24">
            <div className="border border-[#D5D9D9] rounded-lg p-8 flex items-center justify-center h-96 bg-white relative overflow-hidden group">
              <img src={product.image} alt={product.name} className="max-h-full object-contain mix-blend-multiply group-hover:scale-150 transition-transform duration-300" />
            </div>
            
            <div className="flex space-x-2 mt-4 justify-center">
              <div className="w-12 h-12 border border-[#C7511F] rounded cursor-pointer p-1">
                <img src={product.image} className="w-full h-full object-contain" alt="thumbnail 1"/>
              </div>
              <div className="w-12 h-12 border border-[#D5D9D9] rounded cursor-pointer p-1 opacity-60 hover:opacity-100 transition-opacity">
                <img src={product.image} className="w-full h-full object-contain" alt="thumbnail 2"/>
              </div>
            </div>
            
            {/* Sustainability Badge */}
            {product.co2Saved && (
              <div className="mt-4 bg-[#EFFFF3] border border-[#B8E2C4] rounded-lg p-3 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#16a34a] mr-2" />
                <div className="flex flex-col">
                  <span className="text-[#0F1111] font-bold text-sm">Buying this used saves {product.co2Saved || '15kg'} CO₂</span>
                  <span className="text-[#007185] text-xs">Waste Diverted: {Math.floor(Math.random() * 5) + 1}kg • 150 Green Credits Generated</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Details */}
        <div className="md:col-span-5">
          <h1 className="text-2xl font-medium text-[#0F1111] leading-tight">{product.name}</h1>
          <div className="text-sm text-[#007185] mt-1 space-x-2">
            <Link to="#" className="hover:text-[#C7511F] hover:underline">Brand: {product.name.split(' ')[0]}</Link>
            <span className="text-gray-300">|</span>
            <span>Model: {product.name.split(' ').slice(1,3).join(' ')}</span>
            <span className="text-gray-300">|</span>
            <Link to="#" className="hover:text-[#C7511F] hover:underline">Visit the {product.name.split(' ')[0]} Store</Link>
          </div>
          
          {/* Ratings */}
          <div className="flex items-center text-[#FFA41C] mt-2 pb-3 border-b border-[#D5D9D9]">
            {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'text-gray-300 fill-current'}`} />)}
            <ChevronRight className="w-3 h-3 text-[#565959] rotate-90 ml-1" />
            <span className="text-[#007185] text-sm ml-2 hover:underline">{product.sellerReviews || '1,200'} ratings</span>
          </div>

          <div className="py-3 border-b border-[#D5D9D9]">
            {!isUsed && (
              <div className="mb-2 inline-flex items-center bg-[#111111] text-white px-2 py-0.5 rounded-sm">
                <CheckCircle className="w-3 h-3 text-[#16a34a] mr-1" />
                <span className="text-[10px] font-extrabold text-[#FF9900]">AMAZON CERTIFIED OPEN BOX</span>
              </div>
            )}
            <div className="flex items-end">
              <span className="text-sm text-[#CC0C39] font-bold mt-1">₹</span>
              <span className="text-3xl font-medium text-[#CC0C39]">{String(selectedUnit.price).split('.')[0]}</span>
              <span className="text-sm font-medium mt-1">{String(selectedUnit.price).split('.')[1] ? `.${String(selectedUnit.price).split('.')[1]}` : ''}</span>
            </div>
            <div className="text-sm text-[#565959] mt-1">
              Original Price: <span className="line-through">₹{product.originalPrice}</span>
            </div>
            <div className="text-sm font-bold text-[#16a34a] mt-1">
              {(() => {
                try {
                  const orig = parseFloat(String(product.originalPrice).replace(/,/g, ''));
                  const relife = parseFloat(String(selectedUnit.price).replace(/,/g, ''));
                  if (orig && relife) {
                    const saved = orig - relife;
                    const percent = Math.round((saved / orig) * 100);
                    return `Save: ₹${saved.toLocaleString('en-IN')} (${percent}%)`;
                  }
                } catch(e) {}
                return '';
              })()}
            </div>
            <p className="text-sm font-bold mt-2">Inclusive of all taxes</p>
          </div>

          {/* ReLife Core Data */}
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[#D5D9D9] rounded p-3">
                <p className="text-xs text-[#565959] uppercase font-bold mb-1">Condition Score</p>
                <div className="flex items-center">
                  <span className="text-3xl font-extrabold text-[#0F1111]">{selectedUnit.conditionScore}</span>
                  <span className="text-lg text-[#565959] ml-1">/100</span>
                </div>
              </div>
              <div className="border border-[#D5D9D9] rounded p-3 bg-[#F7FAFA]">
                <p className="text-xs text-[#565959] uppercase font-bold mb-1 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#007185]" /> Digital Passport
                </p>
                {product.passportAvailable ? (
                  <>
                    <p className="font-bold text-[#16a34a] text-sm">Verified & Available</p>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        if (product?.id) {
                          navigate(`/relife/passport/${product._id || product.id}`);
                        }
                      }}
                      className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline bg-transparent border-none p-0 cursor-pointer text-left"
                    >
                      View Ledger
                    </button>
                  </>
                ) : (
                  <p className="font-bold text-[#565959] text-sm">Not Available</p>
                )}
              </div>
            </div>
          </div>
          
          {/* New Product vs Recommended Unit Comparison */}
          {location.state?.amazonProduct && location.state?.recommendedUnitId === (selectedUnit.unitId || selectedUnit._id || selectedUnit.id) && (
            <div className="py-4 border-t border-[#D5D9D9] mb-4">
              <h3 className="font-bold text-[#0F1111] mb-3">New Product vs Recommended ReLife Unit</h3>
              <div className="grid grid-cols-2 gap-0 border border-[#D5D9D9] rounded-lg overflow-hidden text-sm text-[#0F1111] shadow-sm">
                <div className="bg-gray-50 p-4 border-r border-[#D5D9D9] flex flex-col items-center text-center">
                  <div className="font-bold mb-2 text-[#565959]">New Amazon Product</div>
                  <div className="text-2xl font-bold text-[#0F1111] mb-4">₹{location.state.amazonProduct.price}</div>
                  <div className="text-xs text-[#565959] space-y-2 w-full mt-2 pt-3 border-t border-[#D5D9D9]">
                    <div className="flex justify-between border-b border-[#D5D9D9]/50 pb-1"><span>Condition</span> <span className="font-bold text-[#0F1111]">New</span></div>
                    <div className="flex justify-between border-b border-[#D5D9D9]/50 pb-1"><span>CO₂ Saved</span> <span>0 kg</span></div>
                    <div className="flex justify-between"><span>Life Extension</span> <span>N/A</span></div>
                  </div>
                </div>
                <div className="bg-[#FF9900]/10 p-4 flex flex-col items-center text-center relative border border-[#e77600] m-0">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#FF9900]"></div>
                  <div className="font-bold text-[#e77600] mb-2 flex items-center justify-center w-full">🏆 AI ReLife Unit</div>
                  <div className="text-2xl font-bold text-[#B12704] mb-4">₹{selectedUnit.price}</div>
                  <div className="text-xs text-[#565959] space-y-2 w-full mt-2 pt-3 border-t border-[#e77600]/30">
                    <div className="flex justify-between font-bold text-[#16a34a] border-b border-[#e77600]/30 pb-1 text-[13px]">
                      <span>Savings</span> <span>₹{calculateSavings(location.state.amazonProduct.price, selectedUnit.price)}</span>
                    </div>
                    <div className="flex justify-between border-b border-[#e77600]/30 pb-1"><span>Condition</span> <span className="font-bold text-[#0F1111]">{selectedUnit.conditionScore}/100</span></div>
                    <div className="flex justify-between border-b border-[#e77600]/30 pb-1"><span>CO₂ Saved</span> <span className="font-bold text-[#16a34a]">{((selectedUnit.unitId || selectedUnit._id || selectedUnit.id || 'abc').toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100) + 10}kg</span></div>
                    <div className="flex justify-between"><span>Life Extension</span> <span className="font-bold text-[#16a34a]">+{((((selectedUnit.unitId || selectedUnit._id || selectedUnit.id || 'abc').toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 50) / 10) + 1).toFixed(1)} Yrs</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Units Selection */}
          <div className="py-4 border-t border-[#D5D9D9]" ref={unitsSectionRef}>
            
            {location.state?.recommendedUnitId === (selectedUnit.unitId || selectedUnit._id || selectedUnit.id) && (
              <div className="mb-4 bg-[#FF9900]/10 border border-[#e77600] rounded-lg p-4 shadow-sm animate-fade-in">
                <div className="flex items-center text-[#B12704] font-bold mb-2">
                  <span className="mr-2 text-xl">🏆</span> AI Recommended Unit
                </div>
                <div className="text-sm text-[#0F1111]">
                  This unit is selected as your best option due to:
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-[#565959]">
                    <li><strong className="text-[#0F1111]">Highest Condition Score</strong> ({selectedUnit.conditionScore}/100)</li>
                    {location.state.amazonProduct && <li><strong className="text-[#0F1111]">Price Advantage</strong> (₹{calculateSavings(location.state.amazonProduct.price, selectedUnit.price)} cheaper than new)</li>}
                    <li><strong className="text-[#0F1111]">{selectedUnit.warrantyMonths} Months Warranty</strong> from {selectedUnit.sellerName}</li>
                    <li><strong className="text-[#0F1111]">Excellent Green Score</strong> with high sustainability impact</li>
                  </ul>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-[#0F1111]">Available Units</h3>
              <button 
                onClick={() => setShowCompareModal(true)}
                className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline bg-transparent p-0"
              >
                Compare Available Units
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {product.availableUnits.map((unit) => (
                <div 
                  key={unit.id}
                  onClick={() => setSelectedUnit(unit)}
                  className={`border rounded-md p-2 cursor-pointer transition-all min-w-[120px] text-center ${
                    selectedUnit.id === unit.id 
                    ? 'border-[#e77600] bg-[#fffaf5] ring-1 ring-[#e77600] shadow-sm' 
                    : 'border-[#D5D9D9] hover:bg-gray-50'
                  }`}
                >
                  <p className="font-bold text-[13px] text-[#0F1111]">[{unit.conditionScore}/100 {unit.conditionLabel}]</p>
                  <p className="text-sm text-[#B12704] font-bold">₹{unit.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Purchase Panel */}
        <div className="md:col-span-3">
          <div className="border border-[#D5D9D9] rounded-lg p-4 sticky top-24 bg-white shadow-sm">
            <h4 className="font-bold text-[#0F1111] mb-2 text-2xl">₹{selectedUnit.price}</h4>
            <p className="text-sm text-[#007185] flex items-center mb-4 cursor-pointer hover:text-[#C7511F] hover:underline">
              <MapPin className="w-4 h-4 mr-1 text-[#0F1111]" /> Deliver to Patna 800020
            </p>
            <h5 className="text-[#007185] font-bold text-lg mb-2">In stock</h5>
            <button 
              className={`w-full rounded-full py-2.5 text-sm font-bold shadow-sm mb-2 transition-colors flex items-center justify-center ${
                cartItems.some(item => item.productId === (selectedUnit._id || selectedUnit.id) || item._id === (selectedUnit._id || selectedUnit.id))
                  ? 'bg-[#16a34a] text-white hover:bg-green-700 border-transparent' 
                  : 'bg-[#FFD814] hover:bg-[#F7CA00] border-[#FCD200]'
              }`}
              onClick={() => {
                const productId = selectedUnit._id || selectedUnit.id;
                const isInCart = cartItems.some(item => item.productId === productId || item._id === productId);
                if (isInCart) {
                  navigate('/cart');
                } else {
                  addToCart({ ...product, ...selectedUnit, productId: selectedUnit._id || selectedUnit.id });
                }
              }}
            >
              <span className="font-bold">
                {cartItems.some(item => item.productId === (selectedUnit._id || selectedUnit.id) || item._id === (selectedUnit._id || selectedUnit.id)) ? '✓ Added to Cart' : 'Add to Cart'}
              </span>
            </button>
            <button 
              className="w-full bg-[#FFA41C] hover:bg-[#FA8900] border border-[#FF8F00] rounded-full py-2.5 text-sm font-bold shadow-sm"
              onClick={() => {
                if (!cartItems.some(item => item.id === selectedUnit.id)) {
                  addToCart({ ...product, ...selectedUnit });
                }
                navigate('/checkout');
              }}
            >
              Buy Now
            </button>
            <div className="mt-4 text-xs text-[#565959] space-y-1 border-b border-[#D5D9D9] pb-4">
              <div className="flex justify-between"><span>Ships from</span> <span>Amazon ReLife Fulfillment</span></div>
              <div className="flex justify-between"><span>Sold by</span> <span className="font-bold text-[#007185] cursor-pointer hover:underline">{selectedUnit.sellerName}</span></div>
              {selectedUnit.sellerRating && (
                <div className="flex justify-between"><span>Seller Rating</span> <span>{selectedUnit.sellerRating} / 5</span></div>
              )}
              {selectedUnit.distance && (
                <div className="flex justify-between"><span>Distance</span> <span>{selectedUnit.distance}</span></div>
              )}
              <div className="flex justify-between"><span>Warranty</span> <span>{selectedUnit.warrantyMonths} Months</span></div>
            </div>
            <button className="w-full mt-4 border border-[#D5D9D9] bg-white hover:bg-gray-50 text-[#0F1111] py-1.5 rounded-md text-sm shadow-sm transition-all text-left px-3">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="border-t border-[#D5D9D9] mt-8 pt-8">
        <h2 className="text-xl font-bold text-[#CC6600] mb-4">Product Description</h2>
        <p className="text-sm text-[#0F1111] max-w-3xl leading-relaxed">
          This {product.name} is a high-quality electronic device that has been fully inspected and restored to excellent working condition. 
          By purchasing from Amazon ReLife, you are actively participating in the circular economy, reducing electronic waste, and extending 
          the lifespan of functional technology. This product includes all standard accessories and is backed by the Amazon ReLife Guarantee.
        </p>
      </div>

      {/* Expanded Details Section */}
      <div className="border-t border-[#D5D9D9] mt-8 pt-8">
        <h2 className="text-xl font-bold text-[#CC6600] mb-4">ReLife AI Inspection & Ledger Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F7FAFA] border border-[#D5D9D9] rounded p-6">
            <h3 className="font-bold mb-3 flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-[#16a34a]" /> AI Visual Inspection</h3>
            <p className="text-sm text-[#0F1111] mb-4">This product has been visually inspected by Amazon ReLife Generative AI. The condition score is an objective measurement based on 14 cosmetic and functional checkpoints.</p>
            <ul className="list-disc pl-5 text-sm text-[#0F1111] space-y-2">
              <li><strong>Display:</strong> No visible scratches under normal lighting.</li>
              <li><strong>Enclosure:</strong> {selectedUnit.inspectionSummary}</li>
              <li><strong>Battery:</strong> Tested and verified to hold {selectedUnit.batteryHealth} capacity.</li>
              <li><strong>Functionality:</strong> Fully functional. Device has been cleared of all personal data.</li>
            </ul>
          </div>
          
          <div className="bg-white border border-[#D5D9D9] rounded p-6">
            <h3 className="font-bold mb-4 flex items-center"><Clock className="w-5 h-5 mr-2 text-[#007185]" /> Product Lifespan & History</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#0F1111]">Ownership History</p>
                  <p className="text-sm text-[#565959]">1 previous owner. Device was originally activated 14 months ago.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Wrench className="w-5 h-5 mr-3 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#0F1111]">Repair History</p>
                  <p className="text-sm text-[#565959]">No major repairs reported. Original battery and screen.</p>
                </div>
              </div>

              <div className="flex items-start">
                <Leaf className="w-5 h-5 mr-3 text-[#16a34a] mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#0F1111]">Expected Lifespan Extension</p>
                  <p className="text-sm text-[#565959]">By purchasing this item, you are extending its life by approximately 2.5 years before recycling is required.</p>
                </div>
              </div>
            </div>
            
            <button 
              className="mt-6 w-full bg-white hover:bg-gray-50 border border-[#D5D9D9] rounded-md px-4 py-2 font-bold text-sm shadow-sm flex justify-center items-center"
              onClick={() => {
                // Ensure product has a passport generated/available before routing
                if (product && (product._id || product.id)) {
                  navigate(`/relife/passport/${product._id || product.id}`);
                }
              }}
            >
              View Full Product Passport <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in mx-4">
            <div className="flex justify-between items-center p-4 border-b border-[#D5D9D9] bg-gray-50">
              <h2 className="text-lg font-bold text-[#0F1111]">Compare Available Units</h2>
              <button onClick={() => setShowCompareModal(false)} className="text-gray-500 hover:text-black">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 overflow-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-[#D5D9D9]">
                    <th className="p-3 font-bold text-gray-700">Condition</th>
                    <th className="p-3 font-bold text-gray-700">Price</th>
                    <th className="p-3 font-bold text-gray-700">Battery Health</th>
                    <th className="p-3 font-bold text-gray-700">Warranty</th>
                    <th className="p-3 font-bold text-gray-700">Seller</th>
                    <th className="p-3 font-bold text-gray-700 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {product.availableUnits.map(unit => (
                    <tr key={unit.id} className={`border-b border-gray-200 hover:bg-gray-50 ${selectedUnit.id === unit.id ? 'bg-[#fffaf5]' : ''}`}>
                      <td className="p-3">
                        <div className="font-bold text-[#0F1111]">{unit.conditionScore}/100</div>
                        <div className="text-xs text-gray-500">{unit.conditionLabel}</div>
                      </td>
                      <td className="p-3 font-bold text-[#B12704]">₹{unit.price}</td>
                      <td className="p-3">{unit.batteryHealth}</td>
                      <td className="p-3">{unit.warrantyMonths} Months</td>
                      <td className="p-3">
                        <div>{unit.sellerName}</div>
                        <div className="text-xs text-[#007185] flex items-center mt-1">
                          <Star className="w-3 h-3 fill-current mr-0.5 text-[#FFA41C]"/> {unit.sellerRating}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          onClick={() => {
                            setSelectedUnit(unit);
                            setShowCompareModal(false);
                          }}
                          className={`px-4 py-1.5 text-xs rounded-full font-bold border transition-colors ${selectedUnit.id === unit.id ? 'bg-[#FF9900] text-black border-[#FF9900]' : 'bg-white hover:bg-gray-50 text-[#0F1111] border-[#D5D9D9] shadow-sm'}`}
                        >
                          {selectedUnit.id === unit.id ? 'Selected' : 'Select'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
