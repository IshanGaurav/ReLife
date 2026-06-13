import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreHorizontal, ArrowUpDown, Download, Plus, Package, Star } from 'lucide-react';
import { getSellerProducts } from '../../api/sellerApi';

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getSellerProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHealthColor = (health) => {
    switch(health) {
      case 'Excellent': return 'bg-green-100 text-green-700 border-green-200';
      case 'Good': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'Needs Attention': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Poor': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeoColor = (score) => {
    if (score >= 90) return 'text-green-600 font-bold';
    if (score >= 70) return 'text-teal-600 font-bold';
    if (score >= 50) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Product Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and optimize your Amazon listings.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-[#14b8a6] hover:bg-teal-600 text-white rounded-lg text-sm font-medium shadow-sm transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products by title or category..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/50 focus:border-[#14b8a6] transition-all bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">Product Name <ArrowUpDown className="w-3 h-3 ml-1" /></div>
                </th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">Rating <ArrowUpDown className="w-3 h-3 ml-1" /></div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">SEO Score <ArrowUpDown className="w-3 h-3 ml-1" /></div>
                </th>
                <th className="px-6 py-4 font-semibold">Listing Health</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 flex items-center justify-center mr-3">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm line-clamp-1">{product.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Last updated: {product.lastUpdated}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm">
                      <span className="font-bold text-gray-900 mr-1">{product.rating}</span>
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500 ml-1.5">({product.reviewCount})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={getSeoColor(product.seoScore)}>{product.seoScore}/100</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getHealthColor(product.listingHealth)}`}>
                      {product.listingHealth}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="px-3 py-1.5 text-xs font-semibold text-[#14b8a6] bg-[#14b8a6]/10 hover:bg-[#14b8a6]/20 rounded transition-colors">
                        Optimize
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
          <div>Showing 1 to {filteredProducts.length} of {products.length} entries</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded text-gray-400 cursor-not-allowed">Prev</button>
            <button className="px-3 py-1 border border-[#14b8a6] bg-[#14b8a6] text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
