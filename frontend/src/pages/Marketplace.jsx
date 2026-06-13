import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MarketplaceSearch from '../components/marketplace/MarketplaceSearch';
import MarketplaceFilters from '../components/marketplace/MarketplaceFilters';
import UsedProductCard from '../components/marketplace/UsedProductCard';
import OpenBoxCard from '../components/marketplace/OpenBoxCard';
import { usedProducts, openBoxProducts } from '../data/mockData';

export default function Marketplace() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on URL path
  const activeTab = location.pathname.includes('/openbox') ? 'openbox' : 'used';

  // --- FILTER STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [conditionRange, setConditionRange] = useState(null);
  const [distanceRange, setDistanceRange] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // --- FILTERING ENGINE ---
  const filteredProducts = useMemo(() => {
    let sourceData = activeTab === 'used' ? usedProducts : openBoxProducts;

    let result = sourceData.filter(product => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const textToSearch = `${product.name} ${product.brand || ''} ${product.category || ''}`.toLowerCase();
        if (!textToSearch.includes(query)) return false;
      }

      if (selectedCategory && product.category !== selectedCategory) return false;

      if (conditionRange) {
        const score = product.conditionScore;
        if (conditionRange === '95-100' && score < 95) return false;
        if (conditionRange === '85-94' && (score < 85 || score > 94)) return false;
        if (conditionRange === '70-84' && (score < 70 || score > 84)) return false;
      }

      if (distanceRange && product.distance) {
        const distNum = parseFloat(product.distance.replace(' km', ''));
        if (distanceRange === '5' && distNum > 5) return false;
        if (distanceRange === '20' && distNum > 20) return false;
        if (distanceRange === 'fc' && distNum > 0) return false;
      }

      if (priceRange.min || priceRange.max) {
        const priceStr = product.relifePrice || product.price || '0';
        const priceNum = parseFloat(priceStr.toString().replace(/,/g, ''));
        
        if (priceRange.min && priceNum < parseFloat(priceRange.min)) return false;
        if (priceRange.max && priceNum > parseFloat(priceRange.max)) return false;
      }

      return true;
    });

    result.sort((a, b) => {
      const getPrice = (p) => parseFloat((p.relifePrice || p.price || '0').toString().replace(/,/g, ''));
      const getDist = (p) => parseFloat((p.distance || '0').toString().replace(' km', ''));

      switch (sortBy) {
        case 'price_low':
          return getPrice(a) - getPrice(b);
        case 'price_high':
          return getPrice(b) - getPrice(a);
        case 'condition':
          return (b.conditionScore || 0) - (a.conditionScore || 0);
        case 'distance':
          return getDist(a) - getDist(b);
        default:
          return 0;
      }
    });

    return result;
  }, [activeTab, searchQuery, selectedCategory, conditionRange, distanceRange, priceRange, sortBy]);

  return (
    <div className="animate-fade-in -mt-4 bg-gray-100 min-h-screen">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-[#D5D9D9] sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex border-b border-[#D5D9D9]">
            <button 
              className={`px-8 py-3 font-bold text-sm border-b-2 ${activeTab === 'used' ? 'border-[#CC6600] text-[#CC6600]' : 'border-transparent text-[#007185] hover:text-[#C7511F]'}`}
              onClick={() => navigate('/relife/marketplace')}
            >
              Buy Used Items
            </button>
            <button 
              className={`px-8 py-3 font-bold text-sm border-b-2 ${activeTab === 'openbox' ? 'border-[#CC6600] text-[#CC6600]' : 'border-transparent text-[#007185] hover:text-[#C7511F]'}`}
              onClick={() => navigate('/relife/openbox')}
            >
              Open Box Deals
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <MarketplaceSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resultCount={filteredProducts.length}
        />

        <div className="flex flex-col md:flex-row mt-6 gap-6">
          <div className="w-full md:w-64 flex-shrink-0">
            <MarketplaceFilters 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              conditionRange={conditionRange}
              setConditionRange={setConditionRange}
              distanceRange={distanceRange}
              setDistanceRange={setDistanceRange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-white border border-[#D5D9D9] rounded-sm">
                <h2 className="text-xl font-bold mb-2">No products match your filters</h2>
                <p className="text-[#565959] mb-4">Try adjusting your search criteria or clearing filters.</p>
                <button 
                  className="bg-white border border-[#D5D9D9] hover:bg-gray-50 px-4 py-2 rounded shadow-sm text-sm font-bold text-[#0F1111]"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setConditionRange(null);
                    setDistanceRange(null);
                    setPriceRange({ min: '', max: '' });
                  }}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeTab === 'used' 
                  ? filteredProducts.map(product => <UsedProductCard key={product.id} product={product} />)
                  : filteredProducts.map(product => <OpenBoxCard key={product.id} product={product} />)
                }
              </div>
            )}
          </div>
        </div>

        {/* Sell Product (Fallback handled via routing, but just in case) */}
        {activeTab === 'sell' && (
          <div className="bg-white p-12 text-center rounded-lg border border-[#D5D9D9]">
            <h3 className="text-2xl font-bold text-[#0F1111] mb-2">Turn Old Tech into Green Credits</h3>
            <button 
              className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-md px-6 py-2 font-bold text-[#0F1111] shadow-sm"
              onClick={() => navigate('/relife/sell')}
            >
              Start Selling
            </button>
          </div>
        )}

        {/* Digital Passports */}
        {activeTab === 'passports' && (
          <div className="bg-white p-12 text-center rounded-lg border border-[#D5D9D9]">
            <h3 className="text-2xl font-bold text-[#0F1111] mb-2">Public Passport Ledger</h3>
            <p className="text-[#565959] mb-6">Verify the authenticity and history of products listed on ReLife.</p>
            <button className="bg-white border border-[#D5D9D9] hover:bg-gray-50 rounded-md px-6 py-2 font-bold text-[#0F1111] shadow-sm">
              Search Passports
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
