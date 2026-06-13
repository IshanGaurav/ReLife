import React, { useState, useEffect } from 'react';
import { ArrowRight, Leaf, ShieldCheck, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReLifeProductCard from '../components/ui/ReLifeProductCard';
import { getUsedProducts, getOpenBoxProducts } from '../api/client';

export default function ReLifeHome() {
  const [usedProducts, setUsedProducts] = useState([]);
  const [openBoxProducts, setOpenBoxProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUsedProducts(), getOpenBoxProducts()])
      .then(([usedData, openBoxData]) => {
        setUsedProducts(usedData);
        setOpenBoxProducts(openBoxData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load ReLife products', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center min-h-screen">Loading ReLife Marketplace...</div>;
  return (
    <div className="animate-fade-in -mt-8 -mx-4 sm:-mx-6 lg:-mx-8 bg-gray-100 min-h-screen">
      
      {/* ReLife Hero Banner */}
      <div className="bg-gradient-to-r from-[#16a34a] to-[#047857] text-white pt-8 pb-32 px-8 flex flex-col justify-center relative overflow-hidden shadow-inner">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-left"></div>
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Give Products a Second Life</h1>
            <p className="text-lg md:text-xl text-green-100 mb-6 font-medium leading-relaxed">
              Buy certified refurbished electronics, find open box deals, or trade in your old devices for Amazon Green Credits.
            </p>
            <div className="flex space-x-6 text-green-50">
              <div>
                <p className="text-3xl font-extrabold">2.4M</p>
                <p className="text-sm uppercase tracking-wide opacity-80">Items Recovered</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">18K<span className="text-xl"> tons</span></p>
                <p className="text-sm uppercase tracking-wide opacity-80">CO₂ Saved</p>
              </div>
            </div>
          </div>

          {/* Primary CTA: Sell an Item */}
          <div className="bg-white text-[#0F1111] p-6 rounded-lg shadow-xl max-w-sm w-full mt-8 md:mt-0 relative z-20">
            <h3 className="text-xl font-bold mb-2">Turn old tech into Credits</h3>
            <p className="text-sm text-[#565959] mb-4">Upload photos and our AI will instantly estimate its value, condition, and circular path.</p>
            <Link to="/relife/sell" className="block">
              <button className="w-full bg-[#FF9900] hover:bg-[#e38800] text-black font-bold py-3 px-4 rounded-md shadow-sm border border-[#F3A847] flex items-center justify-center transition-colors">
                <UploadCloud className="w-5 h-5 mr-2" /> Start Selling
              </button>
            </Link>
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center text-xs text-[#565959]">
              <ShieldCheck className="w-4 h-4 mr-1 text-[#16a34a]" /> Digital Product Passport Included
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-12 space-y-6">
        
        {/* Open Box Deals */}
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold text-[#0F1111]">Open Box Deals Near You</h2>
            <Link to="/relife/openbox" className="text-[#007185] hover:text-[#C7511F] text-sm font-medium hover:underline">See all open box deals</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {openBoxProducts.slice(0, 5).map((prod) => (
              <ReLifeProductCard key={prod._id || prod.id} product={prod} />
            ))}
          </div>
        </div>

        {/* Refurbished Essentials */}
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold text-[#0F1111]">Certified Refurbished & Used</h2>
            <Link to="/relife/marketplace" className="text-[#007185] hover:text-[#C7511F] text-sm font-medium hover:underline">Shop all certified used</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {usedProducts.slice(0, 5).map((prod) => (
              <ReLifeProductCard key={prod._id || prod.id} product={prod} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
