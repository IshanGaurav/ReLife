import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function MarketplaceSearch({ searchQuery, setSearchQuery, sortBy, setSortBy, resultCount }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 bg-white p-4 border border-[#D5D9D9] rounded-md shadow-sm">
      <div className="flex items-center text-sm text-[#0F1111] font-bold mb-4 sm:mb-0">
        {resultCount} Results
      </div>
      
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <input 
            type="text" 
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-[#888C8C] rounded-md pl-10 pr-4 py-1.5 text-sm focus:border-[#007185] focus:ring-1 focus:ring-[#007185] outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <div className="flex items-center text-sm">
          <label className="mr-2 text-[#0F1111]">Sort by:</label>
          <select 
            className="border border-[#D5D9D9] rounded-md p-1.5 bg-[#F0F2F2] hover:bg-[#E3E6E6] cursor-pointer outline-none focus:ring-1 focus:ring-[#007185]"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="condition">Condition Score</option>
            <option value="distance">Distance</option>
          </select>
        </div>
      </div>
    </div>
  );
}
