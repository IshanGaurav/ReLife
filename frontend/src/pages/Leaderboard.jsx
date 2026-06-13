import React, { useState, useMemo, useEffect } from 'react';
import { Leaf, Trophy, Medal, MapPin, Users, Crown, Gift, GiftIcon, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { leaderboardDaily, leaderboardWeekly, leaderboardMonthly, allTimeTopContributors } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

export default function Leaderboard() {
  const { period } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const activeTab = period || 'daily';
  const [filterLevel, setFilterLevel] = useState('city'); // 'national', 'state', 'city'
  const [selectedState, setSelectedState] = useState('Bihar');
  const [selectedCity, setSelectedCity] = useState('Patna');
  const calculateTimeLeft = () => {
    const now = new Date();
    if (activeTab === 'daily') {
      const eod = new Date();
      eod.setHours(23, 59, 59, 999);
      return eod - now;
    } else if (activeTab === 'weekly') {
      const eow = new Date();
      // Calculate next Sunday
      eow.setDate(now.getDate() + (7 - now.getDay())); 
      eow.setHours(23, 59, 59, 999);
      return eow - now;
    } else if (activeTab === 'monthly') {
      const eom = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      eom.setHours(23, 59, 59, 999);
      return eom - now;
    }
    return 0;
  };

  const [timeDiff, setTimeDiff] = useState(calculateTimeLeft());
  
  useEffect(() => {
    setTimeDiff(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeDiff(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [activeTab]);

  const formatTime = (ms) => {
    if (ms <= 0) return '00h 00m 00s';
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor((ms / (1000 * 60)) % 60);
    const h = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const d = Math.floor(ms / (1000 * 60 * 60 * 24));
    
    if (d > 0) return `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const timeLeft = formatTime(timeDiff);

  const getBaseData = () => {
    switch(activeTab) {
      case 'daily': return leaderboardDaily;
      case 'weekly': return leaderboardWeekly;
      case 'monthly': return leaderboardMonthly;
      case 'all-time': return allTimeTopContributors;
      default: return leaderboardDaily;
    }
  };

  const getTierForPoints = (points) => {
    if (points > 5000) return { name: 'Eco Legend', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '🟡' };
    if (points > 3000) return { name: 'Champion Tier', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🟣' };
    if (points > 1500) return { name: 'Circular Citizen', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🔵' };
    return { name: 'Green Starter', color: 'bg-green-100 text-green-800 border-green-200', icon: '🟢' };
  };

  const filteredData = useMemo(() => {
    let data = [...getBaseData()];
    
    if (filterLevel === 'state') {
      data = data.filter(u => u.state === selectedState);
    } else if (filterLevel === 'city') {
      data = data.filter(u => u.city === selectedCity);
    }

    // Inject the current logged in user so they always appear in rankings for the filtered region
    if (user && !data.some(u => u.name === user.name)) {
      data.push({
        id: 'current_user',
        name: user.name,
        city: filterLevel === 'city' ? selectedCity : user.city,
        state: filterLevel === 'state' ? selectedState : user.state,
        points: user.credits,
        itemsRecovered: user.recycled,
        co2Saved: user.co2,
        badge: user.badge,
        avatar: user.avatar,
        isCurrentUser: true
      });
    } else if (user) {
      const existingUser = data.find(u => u.name === user.name);
      if (existingUser) existingUser.isCurrentUser = true;
    }

    return data.sort((a, b) => b.points - a.points).map((u, i) => ({ ...u, rank: i + 1 }));
  }, [activeTab, filterLevel, selectedState, selectedCity, user]);

  const userRankData = useMemo(() => {
    if (!user) return null;
    const currentUserInList = filteredData.find(u => u.isCurrentUser);
    if (!currentUserInList) return null;

    const rank = currentUserInList.rank;
    
    let targetRank = 0;
    if (rank > 200) targetRank = 200;
    else if (rank > 100) targetRank = 100;
    else if (rank > 50) targetRank = 50;
    else if (rank > 25) targetRank = 25;
    else if (rank > 10) targetRank = 10;
    else if (rank > 5) targetRank = 5;
    else if (rank > 3) targetRank = 3;

    let targetDistance = 0;
    if (targetRank > 0 && filteredData[targetRank - 1]) {
      targetDistance = filteredData[targetRank - 1].points - user.credits + 1;
    }
    if (targetDistance <= 0 && targetRank > 0) targetDistance = 1;

    let targetTotal = targetDistance + user.credits;
    let progressPercentage = targetTotal > 0 ? (user.credits / targetTotal) * 100 : 0;

    return { 
      rank, 
      targetRank,
      targetDistance,
      progressPercentage,
      tier: getTierForPoints(user.credits)
    };
  }, [user, filteredData]);

  const handleTabChange = (tab) => {
    navigate(`/leaderboard/${tab}`);
  };

  const getRewardForRank = (rank) => {
    if (activeTab === 'daily') return null;
    if (activeTab === 'weekly') {
      if (rank === 1) return { text: '₹1000 Voucher', color: 'text-yellow-400' };
      if (rank === 2) return { text: '₹500 Voucher', color: 'text-gray-300' };
      if (rank === 3) return { text: '₹250 Voucher', color: 'text-orange-400' };
    }
    if (activeTab === 'monthly') {
      if (rank === 1) return { text: '₹5000 + Champion Badge', color: 'text-yellow-400' };
      if (rank === 2) return { text: '₹3000 Amazon Voucher', color: 'text-gray-300' };
      if (rank === 3) return { text: '₹1500 Amazon Voucher', color: 'text-orange-400' };
      if (rank <= 10) return { text: 'Exclusive Badge', color: 'text-[#16a34a]' };
    }
    return null;
  };

  const top3 = filteredData.slice(0, 3);
  // Ensure the table shows everyone (we could paginate, but let's show top 50 to ensure they see themselves)
  const restOfLeaderboard = filteredData.slice(3, 50);

  const renderPodiumCard = (userData, position) => {
    if (!userData) return null;
    
    const isRank1 = position === 1;
    const isRank2 = position === 2;
    const isRank3 = position === 3;

    const reward = getRewardForRank(position);

    const podiumHeight = isRank1 ? 'h-40 sm:h-56' : isRank2 ? 'h-32 sm:h-44' : 'h-28 sm:h-36';
    const podiumColor = isRank1 
      ? 'from-[#f0c14b]/20 to-[#f0c14b]/5 border-[#f0c14b]' 
      : isRank2 
        ? 'from-gray-300/20 to-gray-300/5 border-gray-300' 
        : 'from-orange-400/20 to-orange-400/5 border-orange-400';
        
    const glowClass = isRank1 
      ? 'shadow-[0_-10px_40px_rgba(240,193,75,0.3)]' 
      : isRank2 
        ? 'shadow-[0_-10px_30px_rgba(209,213,219,0.2)]' 
        : 'shadow-[0_-10px_30px_rgba(251,146,60,0.2)]';

    return (
      <div className={`flex flex-col items-center w-1/3 max-w-[280px] z-${40 - position * 10} animate-fade-in`} style={{ animationDelay: `${position * 100}ms` }}>
        {/* Avatar & Name Card */}
        <div className="flex flex-col items-center mb-4 transform transition-transform hover:-translate-y-2">
          {isRank1 && <Crown className="w-8 h-8 text-[#f0c14b] mb-[-10px] z-10" />}
          <div className={`relative rounded-xl p-1 mb-1 sm:mb-2 ${isRank1 ? 'bg-gradient-to-b from-[#f0c14b] to-transparent' : isRank2 ? 'bg-gradient-to-b from-gray-300 to-transparent' : 'bg-gradient-to-b from-orange-400 to-transparent'}`}>
            <img src={userData.avatar} alt={userData.name} className="w-12 h-12 sm:w-24 sm:h-24 rounded-lg object-cover bg-[#131921]" />
          </div>
          <h3 className="font-bold text-white text-[11px] sm:text-lg text-center leading-tight truncate w-full px-1 sm:px-2">
            {userData.name} {userData.isCurrentUser && <span className="ml-1 text-[8px] bg-[#16a34a] px-1 rounded">YOU</span>}
          </h3>
          <p className="text-gray-400 text-[9px] sm:text-xs flex items-center mt-0.5 sm:mt-1"><MapPin className="w-2 h-2 sm:w-3 sm:h-3 mr-1"/>{userData.city}</p>
        </div>

        {/* Podium Block */}
        <div className={`w-full ${podiumHeight} bg-gradient-to-b ${podiumColor} border-t-2 rounded-t-lg ${glowClass} flex flex-col items-center pt-2 sm:pt-4 px-1 sm:px-2 relative overflow-hidden backdrop-blur-sm`}>
          <div className="absolute inset-0 bg-[#232F3E] opacity-50 -z-10"></div>
          
          <div className={`text-xl sm:text-3xl font-extrabold ${isRank1 ? 'text-[#f0c14b]' : isRank2 ? 'text-gray-300' : 'text-orange-400'} mb-1 sm:mb-2 drop-shadow-md`}>
            #{position}
          </div>
          
          <div className="text-white font-bold text-[10px] sm:text-lg flex items-center">
            {userData.points} <Leaf className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1 text-[#16a34a]" />
          </div>
          
          {reward && (
            <div className={`mt-1 sm:mt-2 text-center text-[9px] sm:text-xs font-bold px-1 sm:px-2 py-0.5 sm:py-1 bg-black/40 rounded-full border border-white/10 w-[95%] mx-auto whitespace-normal leading-tight ${reward.color}`}>
              {reward.text}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Dark Premium Hero Section */}
      <div className="bg-gradient-to-b from-[#131921] via-[#1a222c] to-[#232F3E] pt-8 pb-12 px-4 shadow-xl relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-[#16a34a] rounded-full blur-[120px] opacity-10"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] bg-[#f0c14b] rounded-full blur-[120px] opacity-10"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Header & Region Selector */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex items-center justify-center md:justify-start drop-shadow-lg">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-[#f0c14b] mr-3" />
                Amazon ReLife Champions
              </h1>
              <p className="text-gray-300 text-sm max-w-lg">
                Compete with your community and earn Amazon rewards through sustainable actions and circular economy participation.
              </p>
            </div>

            {/* Premium Dark Region Selector */}
            <div className="bg-[#111111]/60 border border-white/10 rounded-lg p-3 backdrop-blur-md flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center text-gray-300 text-sm font-medium mr-2">
                <MapPin className="w-4 h-4 mr-1 text-[#f0c14b]" /> Region:
              </div>
              <div className="flex bg-[#232F3E] rounded-md p-1 border border-white/5">
                <button 
                  onClick={() => setFilterLevel('national')}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors ${filterLevel === 'national' ? 'bg-[#16a34a] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  National
                </button>
                <button 
                  onClick={() => { setFilterLevel('state'); setSelectedState('Bihar'); }}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors ${filterLevel === 'state' ? 'bg-[#16a34a] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  Bihar
                </button>
                <button 
                  onClick={() => { setFilterLevel('city'); setSelectedCity('Patna'); }}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors ${filterLevel === 'city' ? 'bg-[#16a34a] text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                >
                  Patna
                </button>
              </div>
            </div>
          </div>

          {/* Premium Dark Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-[#111111]/80 backdrop-blur-md rounded-full p-1.5 inline-flex border border-white/10 shadow-lg">
              {['daily', 'weekly', 'monthly', 'all-time'].map((tab) => (
                <button 
                  key={tab}
                  className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all duration-300 ${activeTab === tab ? 'bg-[#f0c14b] text-[#111111] shadow-md transform scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Podium Section */}
          <div className="flex justify-center items-end max-w-4xl mx-auto px-1 sm:px-2 pt-8 min-h-[300px] sm:min-h-[400px]">
            {renderPodiumCard(top3[1], 2)}
            {renderPodiumCard(top3[0], 1)}
            {renderPodiumCard(top3[2], 3)}
          </div>
          
          {/* Base of podium / Countdown Timer */}
          <div className="w-full max-w-4xl mx-auto h-20 bg-gradient-to-b from-[#111111]/80 to-transparent rounded-t-full flex flex-col items-center justify-start mt-4 pt-6">
            {timeLeft && (
              <div className="flex items-center text-[#f0c14b] font-mono font-bold tracking-wider text-sm bg-[#131921] px-5 py-2 rounded-full border border-[#f0c14b]/30 shadow-lg">
                <Clock className="w-4 h-4 mr-2" /> Ends in {timeLeft}
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* User Rank Card */}
          {user && user.credits === 0 ? (
             <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-xl border border-gray-100 flex flex-col items-center justify-center text-center animate-fade-in">
               <h3 className="font-bold text-lg text-[#111] mb-2">Start Selling Products To Earn Green Credits</h3>
               <button onClick={() => navigate('/relife/sell')} className="mt-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-2 rounded-full font-bold transition-colors shadow-sm">
                 Earn Credits
               </button>
             </div>
          ) : user && userRankData ? (
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-xl border border-[#B8E2C4] flex flex-col sm:flex-row items-center justify-between animate-fade-in">
              <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-auto">
                <div className="relative mr-4">
                  <img src={user.avatar} alt="You" className="w-16 h-16 rounded-full border-2 border-[#16a34a]" />
                  <div className="absolute -bottom-2 -right-2 bg-[#131921] text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
                    #{userRankData.rank}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#111] flex items-center">
                    🏆 Your Ranking
                  </h3>
                  <p className="text-sm text-[#565959] mt-0.5">
                    Rank #{userRankData.rank} in {filterLevel === 'city' ? selectedCity : filterLevel === 'state' ? selectedState : 'India'}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs font-bold text-[#16a34a] bg-[#EFFFF3] px-2 py-0.5 rounded-full border border-[#B8E2C4]">
                      {user.credits} Credits
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${userRankData.tier.color}`}>
                      {userRankData.tier.icon} {userRankData.tier.name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100 flex-1 sm:pl-8">
                {userRankData.targetRank > 0 ? (
                  <>
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                      <span className="text-[#565959] font-medium">Need {userRankData.targetDistance} Credits to reach Top {userRankData.targetRank}</span>
                      <span className="font-bold text-[#111]">{Math.round(userRankData.progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 border border-gray-200">
                      <div className="bg-gradient-to-r from-[#16a34a] to-[#4ade80] h-2.5 rounded-full" style={{ width: `${Math.min(userRankData.progressPercentage, 100)}%` }}></div>
                    </div>
                  </>
                ) : (
                  <div className="bg-gradient-to-r from-[#fff7e5] to-[#fff] border border-[#f0c14b]/50 text-[#c45500] px-4 py-3 rounded-lg font-bold shadow-sm flex items-center justify-center">
                    <Crown className="w-6 h-6 mr-2" /> Top 3 Contributor!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-xl border border-gray-100 flex items-center justify-center text-[#565959]">
              Please log in to view your personalized rank.
            </div>
          )}

          {/* Community Stats Card */}
          <div className="bg-white rounded-xl p-6 shadow-xl border border-gray-100 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="font-bold text-[#111] mb-4 flex items-center border-b border-gray-100 pb-2 text-sm">
              <Users className="w-4 h-4 mr-2 text-[#007185]" />
              {filterLevel === 'city' ? selectedCity : filterLevel === 'state' ? selectedState : 'India'} Community Impact
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#565959] text-sm">Products Recovered</span>
                <span className="font-bold text-[#111] bg-gray-50 px-2 py-0.5 rounded">15,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#565959] text-sm">CO₂ Saved</span>
                <span className="font-bold text-[#16a34a] bg-[#EFFFF3] px-2 py-0.5 rounded">52 Tons</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#565959] text-sm">Active Members</span>
                <span className="font-bold text-[#111] bg-gray-50 px-2 py-0.5 rounded">12,500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-12">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="font-bold text-[#111] text-lg">Community Rankings</h2>
            <div className="text-xs text-[#565959] flex items-center bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span> Live Updates
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-xs text-[#565959] uppercase tracking-wider">
                  <th className="p-4 pl-6 font-bold w-16 text-center">Rank</th>
                  <th className="p-4 font-bold">Circular Citizen</th>
                  <th className="p-4 font-bold hidden md:table-cell">Region</th>
                  <th className="p-4 font-bold text-center">Impact</th>
                  <th className="p-4 font-bold text-right">Green Credits</th>
                  <th className="p-4 pr-6 font-bold text-center">Reward Tier</th>
                </tr>
              </thead>
              <tbody>
                {restOfLeaderboard.map((row) => {
                  const isTop10 = row.rank <= 10;
                  const tier = getTierForPoints(row.points);
                  
                  return (
                    <tr key={row.id} className={`border-b transition-colors ${row.isCurrentUser ? 'bg-[#EFFFF3] border-[#B8E2C4]' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <td className="p-4 pl-6 text-center">
                        <span className={`text-sm font-bold ${isTop10 ? 'text-[#111]' : 'text-[#565959]'}`}>#{row.rank}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <img src={row.avatar} alt={row.name} className="w-8 h-8 rounded-full border border-gray-200 mr-3 hidden sm:block" />
                          <div>
                            <p className="font-bold text-[#111] text-sm flex items-center">
                              {row.name}
                              {row.isCurrentUser && <span className="ml-2 bg-[#16a34a] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm">YOU</span>}
                            </p>
                            <p className="text-[10px] text-[#565959]">{row.badge}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-xs text-[#565959] flex items-center"><MapPin className="w-3 h-3 mr-1 text-gray-400"/>{row.city}</span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-bold text-[#111]">{row.itemsRecovered} items</span>
                          <span className="text-[10px] text-[#16a34a]">{row.co2Saved} CO₂</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-bold text-[15px] text-[#111]">
                          {row.points.toLocaleString()}
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <span className={`inline-block px-2 py-1 text-[10px] font-bold rounded border ${tier.color}`}>
                          {tier.icon} {tier.name}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
