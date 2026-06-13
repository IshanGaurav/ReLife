import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPurchaseAssistantDashboardData } from '../../api/recommendationEngine';
import { getPurchaseHistory, getBrandPreferences } from '../../api/fitProfileService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Sparkles, ArrowLeft, History, ShieldCheck, Leaf, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PurchaseAssistantDashboard() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const [dashData, histData, brandData] = await Promise.all([
        getPurchaseAssistantDashboardData(),
        getPurchaseHistory(),
        getBrandPreferences()
      ]);
      setData(dashData);
      setHistory(histData);
      setBrands(brandData);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#14b8a6]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-3 bg-[#14b8a6]/10 rounded-xl mr-4">
            <Sparkles className="w-8 h-8 text-[#14b8a6]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Purchase Assistant</h1>
            <p className="text-sm text-gray-500">Your AI-driven shopping and sizing intelligence hub.</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/profile')} 
          className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag className="w-5 h-5" /></div>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Purchases Analyzed</h3>
          <span className="text-3xl font-black text-gray-900">{data.totalPurchasesAnalyzed}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ShieldCheck className="w-5 h-5" /></div>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Fit Accuracy</h3>
          <span className="text-3xl font-black text-green-600">{data.fitAccuracy}%</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><History className="w-5 h-5" /></div>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Returns Avoided</h3>
          <span className="text-3xl font-black text-orange-600">{data.returnsAvoided}</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#007185]/30 bg-gradient-to-br from-white to-[#007185]/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#007185]/5 rounded-full -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="p-2 bg-[#007185]/20 text-[#007185] rounded-full"><Leaf className="w-5 h-5" /></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total CO₂ Saved</h3>
            <span className="text-3xl font-black text-[#007185]">{data.co2SavedTotal} kg</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Brand Preferences */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Your Brand Sizing Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {brands.map(brand => (
                <div key={brand.brand} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">{brand.brand}</h3>
                    <p className="text-sm text-gray-500">Prefers: <span className="font-bold text-gray-800">{brand.preferredSize}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold uppercase text-gray-400 block mb-1">Success</span>
                    <span className="text-lg font-black text-[#14b8a6]">{brand.successRate}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button onClick={() => navigate('/profile/fit-profile')} className="text-sm font-bold text-[#14b8a6] hover:text-teal-700">
                Update Fit Profile →
              </button>
            </div>
          </div>

          {/* Return History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Sizing History</h2>
            <div className="space-y-4">
              {history.map(item => (
                <div key={item.productId} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.brand} • Size: {item.size} • {item.date}</p>
                  </div>
                  <div>
                    {item.kept ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">Kept</span>
                    ) : (
                      <div className="flex flex-col items-end">
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200 mb-1">Returned</span>
                        <span className="text-[10px] text-gray-500 font-medium">Reason: {item.returnReason}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Purchase Risk Distribution</h2>
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {data.riskDistribution.map(item => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center font-medium text-gray-700">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                    {item.name}
                  </div>
                  <span className="font-bold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-6 leading-relaxed">
              By following our AI Size Recommendations, you maintain a <strong className="text-green-600">75% Low Risk</strong> rate of returning products due to sizing issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
