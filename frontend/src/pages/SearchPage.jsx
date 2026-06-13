import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UsedProductCard from '../components/marketplace/UsedProductCard';
import OpenBoxCard from '../components/marketplace/OpenBoxCard';
import { useMode } from '../context/ModeContext';
import { Star } from 'lucide-react';
import { searchProducts } from '../api/client';

// A simple local card to match Amazon retail products since there is no standalone component
function AmazonProductCard({ prod, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-md border border-gray-200 cursor-pointer group hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="bg-gray-50 h-48 rounded-sm mb-3 p-4 flex items-center justify-center overflow-hidden">
        <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
      </div>
      {prod.rating && (
        <div className="flex items-center space-x-1 mb-1">
          <span className="bg-[#B12704] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">Amazon Retail</span>
        </div>
      )}
      <p className="text-sm font-medium text-[#0F1111] group-hover:text-[#C7511F] line-clamp-2" title={prod.name}>{prod.name}</p>
      
      {prod.rating && (
        <div className="flex items-center text-[#FFA41C] my-1">
          {[...Array(Math.floor(prod.rating))].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
          <span className="text-[#007185] text-xs ml-1 font-medium">{prod.reviews}</span>
        </div>
      )}
      
      <div className="flex items-end mt-1">
        <span className="text-sm align-top mt-1">₹</span>
        <span className="text-2xl font-bold text-[#0F1111]">{String(prod.price).split('.')[0]}</span>
        <span className="text-sm align-top mt-1">{String(prod.price).split('.')[1] ? `.${String(prod.price).split('.')[1]}` : ''}</span>
      </div>
      {prod.oldPrice && <span className="text-xs text-[#565959] line-through mt-0.5">List: ₹{prod.oldPrice}</span>}
    </div>
  );
}

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useMode();

  const queryParams = new URLSearchParams(location.search);
  const rawQuery = queryParams.get('q') || '';
  const searchMode = queryParams.get('mode') || mode;
  const query = rawQuery.toLowerCase();

  const [searchResults, setSearchResults] = useState({ used: [], openBox: [], amazon: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setSearchResults({ used: [], openBox: [], amazon: [] });
      return;
    }

    setLoading(true);
    searchProducts(query, searchMode)
      .then(data => {
        if (searchMode === 'shopping') {
          setSearchResults({ used: [], openBox: [], amazon: data.amazon || [] });
        } else {
          const used = (data.relife || []).filter(p => p.isUsed);
          const openBox = (data.relife || []).filter(p => !p.isUsed);
          setSearchResults({ used, openBox, amazon: [] });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Search API failed', err);
        setLoading(false);
      });
  }, [query, searchMode]);

  const totalResults = searchResults.used.length + searchResults.openBox.length + searchResults.amazon.length;

  const getEmptyStateMessage = () => {
    if (searchMode === 'shopping') {
      return `No Amazon products found for "${rawQuery}"`;
    }
    return `No ReLife products found for "${rawQuery}"`;
  };

  const getEmptyStateSuggestion = () => {
    if (searchMode === 'shopping') {
      return 'Try adjusting your search or switching to ReLife mode for refurbished options.';
    }
    return 'Try checking your spelling. We search across Refurbished, Open Box, and Used Products.';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Search Results for "{rawQuery}"
        </h1>
        <p className="text-gray-600 mt-1">
          Products Found: {totalResults} {searchMode === 'shopping' ? 'Amazon Products' : 'ReLife Products'}
        </p>
      </div>

      {totalResults === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{getEmptyStateMessage()}</h2>
          <p className="text-gray-600 mb-6">{getEmptyStateSuggestion()}</p>
          <button 
            onClick={() => navigate(searchMode === 'shopping' ? '/' : '/relife')}
            className="bg-[#F3A847] hover:bg-[#e39c42] px-6 py-2 rounded-full font-bold text-gray-900 transition-colors shadow-sm"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* AMAZON MODE RESULTS */}
          {searchMode === 'shopping' && searchResults.amazon.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-[#0F1111] mb-4 border-b border-gray-200 pb-2">Amazon Retail Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {searchResults.amazon.map(product => (
                  <AmazonProductCard 
                    key={product._id} 
                    prod={product} 
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* RELIFE MODE RESULTS */}
          {searchMode === 'relife' && searchResults.used.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Used Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.used.map(product => (
                  <UsedProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}

          {searchMode === 'relife' && searchResults.openBox.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Open Box Deals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {searchResults.openBox.map(product => (
                  <OpenBoxCard key={product._id || product.id} product={product} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
