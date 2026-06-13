import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Star, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAmazonProducts } from '../api/client';

export default function AmazonHome() {
  const navigate = useNavigate();
  const [amazonProducts, setAmazonProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAmazonProducts()
      .then(data => {
        setAmazonProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load Amazon products', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center min-h-screen">Loading products...</div>;

  return (
    <div className="animate-fade-in -mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Top Secondary Nav */}
      <div className="bg-amazon-light-blue text-white text-sm px-4 py-2 flex items-center space-x-6 shadow-sm overflow-x-auto whitespace-nowrap">
        <div className="flex items-center cursor-pointer hover:text-amazon-orange font-bold">
          <MapPin className="w-4 h-4 mr-1" />
          <span>Deliver to New York 10001</span>
        </div>
        <div className="hidden md:flex space-x-6 font-bold text-gray-200">
          <span className="cursor-pointer hover:text-white">Today's Deals</span>
          <span className="cursor-pointer hover:text-white">Customer Service</span>
          <span className="cursor-pointer hover:text-white">Registry</span>
          <span className="cursor-pointer hover:text-white">Gift Cards</span>
          <span className="cursor-pointer hover:text-white">Sell</span>
        </div>
      </div>

      {/* Hero Carousel Area */}
      <div className="bg-gradient-to-r from-amazon-blue to-gray-800 text-white pt-12 pb-32 px-8 flex items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">Spring into tech upgrades</h1>
          <p className="text-xl text-gray-300 mb-8 font-medium">Discover the latest electronics, smart home devices, and exclusive deals curated just for you.</p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 space-y-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Category Cards */}
          {[
            { title: 'Gaming accessories', img: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=500&auto=format&fit=crop' },
            { title: 'Refresh your space', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=500&auto=format&fit=crop' },
            { title: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500&auto=format&fit=crop' },
            { title: 'Beauty picks', img: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?q=80&w=500&auto=format&fit=crop' },
          ].map((cat, i) => (
            <div key={i} className="bg-white p-5 rounded-md shadow-sm border border-gray-100 flex flex-col h-full cursor-pointer hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-amazon-blue mb-4">{cat.title}</h2>
              <div className="flex-1 rounded-sm overflow-hidden bg-gray-100">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <p className="text-sm text-blue-700 mt-4 font-medium hover:text-amazon-orange hover:underline">See more</p>
            </div>
          ))}
        </div>

        {/* Featured Items Row */}
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-100 mt-6">
          <h2 className="text-2xl font-bold text-amazon-blue mb-6">Trending Deals</h2>
          <div className="flex space-x-6 overflow-x-auto pb-4 hide-scrollbar">
            {amazonProducts.map((prod) => {
              const productId = prod._id || prod.id;
              return (
              <div 
                key={productId} 
                onClick={() => navigate(`/product/${productId}`)}
                className="min-w-[200px] max-w-[200px] flex flex-col cursor-pointer group"
              >
                <div className="bg-gray-50 h-48 rounded-sm mb-3 p-4 flex items-center justify-center overflow-hidden">
                  <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex items-center space-x-1 mb-1">
                  <span className="bg-red-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">Deal</span>
                  <span className="text-red-700 text-[10px] font-bold">Limited time</span>
                </div>
                <p className="text-sm font-medium text-amazon-blue group-hover:text-amazon-orange truncate" title={prod.name}>{prod.name}</p>
                <div className="flex items-center text-yellow-500 my-1">
                  {[...Array(Math.floor(prod.rating))].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  <span className="text-[#007185] text-xs ml-1 font-medium">{prod.reviews}</span>
                </div>
                <div className="flex items-end mt-1">
                  <span className="text-sm align-top mt-1">₹</span>
                  <span className="text-2xl font-bold text-amazon-blue">{String(prod.price).split('.')[0]}</span>
                  <span className="text-sm align-top mt-1">{String(prod.price).split('.')[1] ? `.${String(prod.price).split('.')[1]}` : ''}</span>
                </div>
                <span className="text-xs text-[#565959] line-through mt-0.5">List: ₹{prod.oldPrice}</span>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
