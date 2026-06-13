import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, Award, Recycle, ShoppingBag, Truck, Calendar, TreePine, Wind, Zap, Trophy, Sparkles, Ruler, ChevronRight } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { transactionHistory, purchaseHistory, sellingHistory, sustainabilityChartData } from '../data/mockData';

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-[#D5D9D9] p-4 rounded shadow-sm flex flex-col justify-center items-center text-center">
                <Leaf className="w-8 h-8 text-[#16a34a] mb-2" />
                <h3 className="text-3xl font-bold text-[#111]">{user.credits}</h3>
                <p className="text-sm text-[#565959]">Green Credits</p>
              </div>
              <div className="bg-white border border-[#D5D9D9] p-4 rounded shadow-sm flex flex-col justify-center items-center text-center">
                <Recycle className="w-8 h-8 text-[#007185] mb-2" />
                <h3 className="text-3xl font-bold text-[#111]">{user.recycled}</h3>
                <p className="text-sm text-[#565959]">Items Recycled</p>
              </div>
              <div className="bg-white border border-[#D5D9D9] p-4 rounded shadow-sm flex flex-col justify-center items-center text-center">
                <Wind className="w-8 h-8 text-[#C7511F] mb-2" />
                <h3 className="text-3xl font-bold text-[#111]">{user.co2}</h3>
                <p className="text-sm text-[#565959]">CO₂ Saved</p>
              </div>
            </div>

            {/* Sustainability Impact Chart */}
            <div className="bg-white border border-[#D5D9D9] p-6 rounded shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#111]">Your Sustainability Impact</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sustainabilityChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007185" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#007185" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="co2" name="CO2 Saved (kg)" stroke="#16a34a" fillOpacity={1} fill="url(#colorCo2)" />
                    <Area type="monotone" dataKey="waste" name="Waste Diverted (kg)" stroke="#007185" fillOpacity={1} fill="url(#colorWaste)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center justify-around mt-6 pt-4 border-t border-[#D5D9D9]">
                <div className="text-center">
                  <p className="text-xs text-[#565959] uppercase font-bold tracking-wider">Equivalent to</p>
                  <p className="text-lg font-bold flex items-center justify-center text-[#111]"><TreePine className="w-5 h-5 mr-1 text-[#16a34a]"/> 14 Trees Planted</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#565959] uppercase font-bold tracking-wider">Waste Diverted</p>
                  <p className="text-lg font-bold flex items-center justify-center text-[#111]"><Recycle className="w-5 h-5 mr-1 text-[#007185]"/> 30 kg</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white border border-[#D5D9D9] p-6 rounded shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#111]">Achievements & Badges</h2>
              <div className="flex flex-wrap gap-4">
                <div className="bg-[#f2fcf5] border border-[#bbf7d0] p-4 rounded flex items-center flex-1 min-w-[200px]">
                  <div className="bg-[#16a34a] rounded-full p-2 mr-3">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111]">Green Starter</h4>
                    <p className="text-xs text-[#565959]">Joined ReLife Program</p>
                  </div>
                </div>
                <div className="bg-[#f0f8ff] border border-[#bae6fd] p-4 rounded flex items-center flex-1 min-w-[200px]">
                  <div className="bg-[#0284c7] rounded-full p-2 mr-3">
                    <Recycle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111]">Circular Citizen</h4>
                    <p className="text-xs text-[#565959]">Recycled 5+ Items</p>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 p-4 rounded flex items-center flex-1 min-w-[200px] opacity-60">
                  <div className="bg-gray-300 rounded-full p-2 mr-3">
                    <Award className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#111]">Eco Legend</h4>
                    <p className="text-xs text-[#565959]">Recycle 20+ Items to unlock</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'credits':
        return (
          <div className="bg-white border border-[#D5D9D9] p-6 rounded shadow-sm animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#111]">Credit Transactions</h2>
              <span className="bg-[#EFFFF3] text-[#16a34a] px-3 py-1 rounded-full text-sm font-bold">Balance: {user.credits}</span>
            </div>
            <div className="space-y-4">
              {transactionHistory.map((tx) => (
                <div key={tx.id} className="flex justify-between items-center p-4 border border-gray-100 rounded hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full mr-4 ${tx.type === 'earn' ? 'bg-[#EFFFF3] text-[#16a34a]' : 'bg-[#fff0f0] text-[#C40000]'}`}>
                      {tx.type === 'earn' ? <Zap className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111]">{tx.title}</h4>
                      <p className="text-xs text-[#565959]">{tx.date} • {tx.reason}</p>
                    </div>
                  </div>
                  <div className={`font-bold text-lg ${tx.type === 'earn' ? 'text-[#16a34a]' : 'text-[#C40000]'}`}>
                    {tx.type === 'earn' ? '+' : ''}{tx.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'purchases':
        return (
          <div className="bg-white border border-[#D5D9D9] p-6 rounded shadow-sm animate-fade-in">
            <h2 className="text-xl font-bold text-[#111] mb-6">Purchase History</h2>
            <div className="space-y-4">
              {purchaseHistory.map((order) => (
                <div key={order.id} className="border border-[#D5D9D9] rounded p-4">
                  <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-100 text-sm">
                    <div className="flex space-x-6 text-[#565959]">
                      <div>
                        <p className="text-xs">ORDER PLACED</p>
                        <p className="text-[#111]">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-xs">TOTAL</p>
                        <p className="text-[#111]">{order.total}</p>
                      </div>
                      <div>
                        <p className="text-xs">TYPE</p>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-[#111] mt-1 inline-block">{order.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#565959]">ORDER # {order.id}</p>
                      <a href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline">View invoice</a>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#111] text-lg">{order.title}</h4>
                      <p className="text-[#16a34a] font-bold text-sm flex items-center mt-1"><Truck className="w-4 h-4 mr-1"/> {order.status}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {(order.title.toLowerCase().includes('shoe') || order.title.toLowerCase().includes('shirt') || order.title.toLowerCase().includes('nike') || order.title.toLowerCase().includes('jacket')) && (
                        <button 
                          onClick={() => navigate('/profile/purchase-assistant')}
                          className="bg-white border border-[#14b8a6] hover:bg-[#f0fdfa] text-[#0d9488] rounded py-1 px-3 text-sm font-bold shadow-sm flex items-center transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 mr-1" /> View AI Fit Analysis
                        </button>
                      )}
                      <button className="bg-[#f0c14b] border border-[#a88734] hover:bg-[#f4d078] rounded py-1 px-4 text-sm text-[#111] shadow-sm">
                        View Digital Passport
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'sales':
        return (
          <div className="bg-white border border-[#D5D9D9] p-6 rounded shadow-sm animate-fade-in">
            <h2 className="text-xl font-bold text-[#111] mb-6">Selling & Trade-In History</h2>
            <div className="space-y-4">
              {sellingHistory.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 border border-gray-200 rounded">
                  <div>
                    <h4 className="font-bold text-[#111] text-lg">{item.title}</h4>
                    <p className="text-sm text-[#565959] mt-1">{item.date} • {item.type}</p>
                    <span className="inline-block mt-2 bg-gray-100 text-[#111] text-xs px-2 py-1 rounded-full border border-gray-300">
                      Status: {item.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[#111] font-bold text-xl">{item.revenue}</p>
                    <p className="text-[#16a34a] text-sm font-bold flex items-center justify-end mt-1">
                      +{item.credits} Credits <Leaf className="w-3 h-3 ml-1" />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white border border-[#D5D9D9] rounded-lg p-6 mb-6 shadow-sm flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 justify-between">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-[#16a34a] shadow-md" />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-[#111111]">{user.name}</h1>
            <p className="text-[#565959]">{user.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
              <span className="flex items-center text-sm font-bold text-[#16a34a] bg-[#EFFFF3] px-3 py-1 rounded-full border border-[#B8E2C4]">
                <Award className="w-4 h-4 mr-1" /> {user.badge}
              </span>
              <span className="flex items-center text-sm text-[#565959]">
                <Calendar className="w-4 h-4 mr-1" /> Member Since {user.memberSince}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-[#D5D9D9] p-4 rounded-lg hidden lg:flex flex-col min-w-[250px]">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-[#111] text-sm">Profile Completion</h4>
            <span className="font-bold text-[#007185] text-sm">85%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-[#007185] h-2.5 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="text-xs text-[#565959] text-center">Add a verified phone number to reach 100%.</p>
        </div>
      </div>

      {/* AI Purchase Assistant Premium Action Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 text-[#14b8a6] mr-2" /> AI Shopping Assistant
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => navigate('/profile/fit-profile')}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center text-gray-900 font-bold text-lg mb-2">
                <Ruler className="w-5 h-5 mr-2 text-gray-600" /> Fit Profile
              </div>
              <p className="text-sm text-gray-600 mb-4 pr-4 leading-relaxed">
                Manage your measurements and preferences to receive accurate size recommendations.
              </p>
            </div>
            <button className="text-sm font-bold text-gray-900 group-hover:text-black transition-colors flex items-center mt-2">
              Manage Fit Profile <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div 
            onClick={() => navigate('/profile/purchase-assistant')}
            className="bg-gradient-to-br from-[#14b8a6]/10 to-transparent border border-[#14b8a6]/20 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center text-gray-900 font-bold text-lg mb-2">
                <Sparkles className="w-5 h-5 mr-2 text-[#14b8a6]" /> AI Purchase Assistant
              </div>
              <p className="text-sm text-gray-600 mb-4 pr-4 leading-relaxed">
                View your size recommendations, return-risk insights, brand preferences, and sustainability impact.
              </p>
            </div>
            <button className="text-sm font-bold text-[#0d9488] group-hover:text-teal-700 transition-colors flex items-center mt-2">
              Open Dashboard <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-[#D5D9D9] rounded shadow-sm overflow-hidden sticky top-24">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors ${activeTab === 'dashboard' ? 'border-[#e77600] bg-gray-50 text-[#111]' : 'border-transparent text-[#007185] hover:bg-gray-50 hover:text-[#C7511F]'}`}
            >
              Sustainability Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('credits')}
              className={`w-full text-left px-4 py-3 text-sm font-medium border-t border-gray-100 border-l-4 transition-colors ${activeTab === 'credits' ? 'border-[#e77600] bg-gray-50 text-[#111]' : 'border-transparent text-[#007185] hover:bg-gray-50 hover:text-[#C7511F]'}`}
            >
              Credit Transactions
            </button>
            <button 
              onClick={() => setActiveTab('purchases')}
              className={`w-full text-left px-4 py-3 text-sm font-medium border-t border-gray-100 border-l-4 transition-colors ${activeTab === 'purchases' ? 'border-[#e77600] bg-gray-50 text-[#111]' : 'border-transparent text-[#007185] hover:bg-gray-50 hover:text-[#C7511F]'}`}
            >
              Purchase History
            </button>
            <button 
              onClick={() => setActiveTab('sales')}
              className={`w-full text-left px-4 py-3 text-sm font-medium border-t border-gray-100 border-l-4 transition-colors ${activeTab === 'sales' ? 'border-[#e77600] bg-gray-50 text-[#111]' : 'border-transparent text-[#007185] hover:bg-gray-50 hover:text-[#C7511F]'}`}
            >
              Selling & Trade-In
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 text-sm font-medium border-t border-gray-100 border-l-4 transition-colors ${activeTab === 'settings' ? 'border-[#e77600] bg-gray-50 text-[#111]' : 'border-transparent text-[#007185] hover:bg-gray-50 hover:text-[#C7511F]'}`}
            >
              Account Settings
            </button>
            <div className="border-t border-[#D5D9D9] mt-2 mb-2"></div>
            <button 
              onClick={() => navigate('/profile/purchase-assistant')}
              className="w-full text-left px-4 py-3 text-sm font-bold border-transparent text-[#14b8a6] hover:bg-teal-50 hover:text-teal-700 flex items-center justify-between"
            >
              AI Purchase Assistant <Sparkles className="w-4 h-4 ml-2" />
            </button>
            <button 
              onClick={() => navigate('/profile/fit-profile')}
              className="w-full text-left px-4 py-3 text-sm font-medium border-t border-gray-100 border-transparent text-[#007185] hover:bg-gray-50 hover:text-[#C7511F]"
            >
              Your Fit Profile
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
