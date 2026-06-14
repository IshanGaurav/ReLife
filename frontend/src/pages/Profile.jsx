import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, Award, Recycle, ShoppingBag, Truck, Calendar, TreePine, Wind, Zap, Trophy, Sparkles, Ruler, ChevronRight, Loader2 } from 'lucide-react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { transactionHistory, sellingHistory } from '../data/mockData';
import { getSustainabilityApi, getMyOrdersApi, getTransactionsApi, getCreditBalanceApi } from '../api/client';

export default function Profile() {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'dashboard');
  const navigate = useNavigate();
  const [sustainabilityData, setSustainabilityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [creditBalance, setCreditBalance] = useState(0);
  const [isCreditsLoading, setIsCreditsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getSustainabilityApi().then(data => {
        if (data && data.success) {
          setSustainabilityData(data);
        }
        setIsLoading(false);
      }).catch(err => {
        console.error(err);
        setIsLoading(false);
      });

      getMyOrdersApi().then(data => {
        if (data && data.success) {
          setOrders(data.orders);
        }
        setIsOrdersLoading(false);
      }).catch(err => {
        console.error(err);
        setIsOrdersLoading(false);
      });

      getTransactionsApi().then(data => {
        if (data && data.success) {
          setTransactions(data.transactions);
        }
        setIsCreditsLoading(false);
      });

      getCreditBalanceApi().then(data => {
        if (data && data.success) {
          setCreditBalance(data.balance);
        }
      });
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getBadge = (credits) => {
    if (credits >= 5000) return 'Platinum';
    if (credits >= 1500) return 'Gold';
    if (credits >= 500) return 'Silver';
    return 'Bronze';
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#D5D9D9] p-4 rounded shadow-sm flex flex-col justify-center items-center text-center">
                <Leaf className="w-8 h-8 text-[#16a34a] mb-2" />
                <h3 className="text-3xl font-bold text-[#111]">{user.greenCredits || 0}</h3>
                <p className="text-sm text-[#565959]">Green Credits</p>
              </div>
              <div className="bg-white border border-[#D5D9D9] p-4 rounded shadow-sm flex flex-col justify-center items-center text-center">
                <Recycle className="w-8 h-8 text-[#007185] mb-2" />
                <h3 className="text-3xl font-bold text-[#111]">{user.itemsReused || 0}</h3>
                <p className="text-sm text-[#565959]">Items Reused</p>
              </div>
              <div className="bg-white border border-[#D5D9D9] p-4 rounded shadow-sm flex flex-col justify-center items-center text-center">
                <Wind className="w-8 h-8 text-[#C7511F] mb-2" />
                <h3 className="text-3xl font-bold text-[#111]">{user.co2Saved || 0}</h3>
                <p className="text-sm text-[#565959]">CO₂ Saved</p>
              </div>
              <div className="bg-white border border-[#D5D9D9] p-4 rounded shadow-sm flex flex-col justify-center items-center text-center">
                <ShoppingBag className="w-8 h-8 text-[#9333ea] mb-2" />
                <h3 className="text-3xl font-bold text-[#111]">{user.soldCount || 0}</h3>
                <p className="text-sm text-[#565959]">Items Sold</p>
              </div>
            </div>

            {/* Sustainability Impact Chart */}
            <div className="bg-white border border-[#D5D9D9] p-6 rounded shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-[#111]">Your Sustainability Impact</h2>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#007185]" />
                </div>
              ) : sustainabilityData && (sustainabilityData.itemsReused > 0 || sustainabilityData.greenCredits > 0 || sustainabilityData.co2Saved > 0) ? (
                <>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sustainabilityData.monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                      <p className="text-lg font-bold flex items-center justify-center text-[#111]"><TreePine className="w-5 h-5 mr-1 text-[#16a34a]"/> {sustainabilityData.treesEquivalent || 0} Trees Planted</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-[#565959] uppercase font-bold tracking-wider">Waste Diverted</p>
                      <p className="text-lg font-bold flex items-center justify-center text-[#111]"><Recycle className="w-5 h-5 mr-1 text-[#007185]"/> {sustainabilityData.wasteDiverted || 0} kg</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-[#565959]">
                  <Leaf className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="font-bold text-lg text-[#111] mb-2">No sustainability activity yet.</p>
                  <p className="mb-4">Purchase a ReLife product to start making an impact.</p>
                  <button onClick={() => navigate('/relife')} className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg px-6 py-2 font-bold shadow-sm text-[#111]">
                    Shop ReLife
                  </button>
                </div>
              )}
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
              <span className="bg-[#EFFFF3] text-[#16a34a] px-3 py-1 rounded-full text-sm font-bold">Balance: {creditBalance}</span>
            </div>
            
            {isCreditsLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-[#007185]" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 border border-gray-100 rounded">
                <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-700">No Transactions Yet</h3>
                <p className="text-gray-500 mt-1">Start shopping ReLife products to earn Green Credits!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx._id} className="flex justify-between items-center p-4 border border-gray-100 rounded hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-4 ${['PURCHASE', 'SELL', 'RECYCLE'].includes(tx.type) ? 'bg-[#EFFFF3] text-[#16a34a]' : 'bg-[#fff0f0] text-[#C40000]'}`}>
                        {['PURCHASE', 'SELL', 'RECYCLE'].includes(tx.type) ? <Zap className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#111]">{tx.description}</h4>
                        <p className="text-xs text-[#565959]">
                          {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {tx.productName}
                          {tx.co2Saved > 0 && ` • ${tx.co2Saved}kg CO₂ Saved`}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold text-lg ${['PURCHASE', 'SELL', 'RECYCLE'].includes(tx.type) ? 'text-[#16a34a]' : 'text-[#C40000]'}`}>
                      {['PURCHASE', 'SELL', 'RECYCLE'].includes(tx.type) ? '+' : '-'}{tx.credits}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'purchases':
        return (
          <div className="bg-white border border-[#D5D9D9] p-6 rounded shadow-sm animate-fade-in">
            <h2 className="text-xl font-bold text-[#111] mb-6">Your Orders</h2>
            
            {isOrdersLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-[#007185]" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#111] mb-2">You have not placed any orders yet.</h3>
                <p className="text-[#565959] mb-6">When you buy items, they will appear here.</p>
                <button 
                  onClick={() => navigate('/relife')}
                  className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-lg px-6 py-2 font-bold shadow-sm text-[#111]"
                >
                  Explore ReLife Marketplace
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border border-[#D5D9D9] rounded overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-50 flex justify-between items-center p-4 border-b border-[#D5D9D9] text-sm">
                      <div className="flex space-x-8 text-[#565959]">
                        <div>
                          <p className="text-xs uppercase">Order Placed</p>
                          <p className="text-[#111]">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase">Total</p>
                          <p className="text-[#111]">₹{order.totalAmount}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#565959] uppercase">Order # {order._id.substring(order._id.length - 8).toUpperCase()}</p>
                        <a href="#" className="text-[#007185] hover:text-[#C7511F] hover:underline">View invoice</a>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="p-4 space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                          <div className="w-24 h-24 flex-shrink-0 bg-gray-50 border border-gray-200 rounded p-1 flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                            ) : (
                              <ShoppingBag className="w-8 h-8 text-gray-300" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-bold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer text-lg mb-1">{item.name}</h4>
                            <p className="text-[#16a34a] font-bold text-sm flex items-center mb-2"><Truck className="w-4 h-4 mr-1"/> {order.status === 'pending' ? 'Arriving soon' : order.status}</p>
                            
                            {item.productType === 'RelifeProduct' && (
                              <div className="bg-[#f0fdfa] border border-[#ccfbf1] p-3 rounded mb-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                <div>
                                  <span className="text-[#565959] block">Condition</span>
                                  <span className="font-bold text-[#111]">{item.conditionScore || 'Excellent'}</span>
                                </div>
                                <div>
                                  <span className="text-[#565959] block">Credits Earned</span>
                                  <span className="font-bold text-[#16a34a] flex items-center"><Zap className="w-3 h-3 mr-0.5" /> +{item.greenCredits || 150}</span>
                                </div>
                                <div>
                                  <span className="text-[#565959] block">CO₂ Saved</span>
                                  <span className="font-bold text-[#007185] flex items-center"><Wind className="w-3 h-3 mr-0.5" /> {item.co2Saved || 45} kg</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200 uppercase text-[10px] font-bold">ReLife Unit</span>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-3 mt-2">
                              <button className="bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] rounded py-1 px-4 text-sm text-[#111] shadow-sm">
                                View Product
                              </button>
                              {item.productType === 'RelifeProduct' && (
                                <button className="bg-white border border-[#D5D9D9] hover:bg-gray-50 rounded py-1 px-4 text-sm text-[#111] shadow-sm flex items-center">
                                  <Award className="w-4 h-4 mr-1 text-[#007185]" /> View Passport
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <Award className="w-4 h-4 mr-1" /> {getBadge(user.greenCredits || 0)}
              </span>
              <span className="flex items-center text-sm text-[#565959]">
                <Calendar className="w-4 h-4 mr-1" /> Member Since {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
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
