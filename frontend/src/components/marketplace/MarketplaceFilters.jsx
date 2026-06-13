import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function MarketplaceFilters({ 
  selectedCategory, setSelectedCategory, 
  conditionRange, setConditionRange, 
  distanceRange, setDistanceRange, 
  priceRange, setPriceRange 
}) {
  // Local state for price inputs before applying
  const [localPrice, setLocalPrice] = useState({ min: priceRange.min, max: priceRange.max });

  return (
    <div className="w-full sm:w-64 flex-shrink-0 bg-white p-4 border border-[#D5D9D9] rounded-md h-fit hidden md:block">
      <h3 className="font-bold text-[#0F1111] mb-4 text-lg">Filters</h3>
      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-bold text-sm text-[#0F1111] mb-2">Category</h3>
        <ul className="text-sm space-y-1.5">
          <li>
            <button 
              className={`hover:text-[#C7511F] text-left ${selectedCategory === null ? 'font-bold text-[#0F1111]' : 'text-[#0F1111]'}`}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </button>
          </li>
          {['Smartphones', 'Laptops', 'Audio', 'Smart Home'].map(cat => (
            <li key={cat}>
              <button 
                className={`hover:text-[#C7511F] text-left ${selectedCategory === cat ? 'font-bold text-[#E47911]' : 'text-[#0F1111]'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-sm text-[#0F1111] mb-2">AI Condition Score</h3>
        <div className="space-y-2 text-sm text-[#0F1111]">
          {['95-100', '85-94', '70-84'].map(range => (
            <label key={range} className="flex items-center cursor-pointer hover:text-[#C7511F]">
              <input 
                type="radio" 
                name="condition"
                className="w-4 h-4 mr-2 accent-[#007185]" 
                checked={conditionRange === range}
                onChange={() => setConditionRange(range)}
              />
              <span>{range}</span>
            </label>
          ))}
          {conditionRange && (
            <button className="text-[#007185] hover:text-[#C7511F] hover:underline text-xs mt-1" onClick={() => setConditionRange(null)}>Clear</button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-sm text-[#0F1111] mb-2">Distance</h3>
        <div className="space-y-2 text-sm text-[#0F1111]">
          <label className="flex items-center cursor-pointer hover:text-[#C7511F]">
            <input type="radio" name="dist" checked={distanceRange === null} onChange={() => setDistanceRange(null)} className="w-4 h-4 mr-2 accent-[#007185]" /> Any Distance
          </label>
          <label className="flex items-center cursor-pointer hover:text-[#C7511F]">
            <input type="radio" name="dist" checked={distanceRange === '5'} onChange={() => setDistanceRange('5')} className="w-4 h-4 mr-2 accent-[#007185]" /> Under 5 km
          </label>
          <label className="flex items-center cursor-pointer hover:text-[#C7511F]">
            <input type="radio" name="dist" checked={distanceRange === '20'} onChange={() => setDistanceRange('20')} className="w-4 h-4 mr-2 accent-[#007185]" /> Under 20 km
          </label>
          <label className="flex items-center cursor-pointer hover:text-[#C7511F]">
            <input type="radio" name="dist" checked={distanceRange === 'fc'} onChange={() => setDistanceRange('fc')} className="w-4 h-4 mr-2 accent-[#007185]" /> Fulfillment Center
          </label>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-bold text-sm text-[#0F1111] mb-2">Price</h3>
        <div className="flex items-center space-x-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={localPrice.min}
            onChange={(e) => setLocalPrice({ ...localPrice, min: e.target.value })}
            className="w-16 px-2 py-1 border border-[#888C8C] rounded shadow-inner text-sm outline-none focus:border-[#FF9900]" 
          />
          <span className="text-gray-500">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={localPrice.max}
            onChange={(e) => setLocalPrice({ ...localPrice, max: e.target.value })}
            className="w-16 px-2 py-1 border border-[#888C8C] rounded shadow-inner text-sm outline-none focus:border-[#FF9900]" 
          />
          <button 
            className="px-3 py-1 bg-white border border-[#D5D9D9] hover:bg-gray-50 rounded shadow-sm text-sm"
            onClick={() => setPriceRange(localPrice)}
          >
            Go
          </button>
        </div>
        {(priceRange.min || priceRange.max) && (
          <button className="text-[#007185] hover:text-[#C7511F] hover:underline text-xs mt-2" onClick={() => { setLocalPrice({min: '', max: ''}); setPriceRange({min: '', max: ''}); }}>Clear price</button>
        )}
      </div>
    </div>
  );
}
