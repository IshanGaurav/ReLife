import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, MapPin, Menu, ChevronDown, Leaf, User, Clock, Bell } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { searchProducts, getRecommendation, getRelifeProduct, getNotificationsApi, markNotificationReadApi } from '../api/client';

export default function Navbar() {
  const { mode, toggleMode, setMode } = useMode();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Automatic Route-Based Sync
  useEffect(() => {
    const isRelifeRoute = location.pathname.startsWith('/relife');
    const expectedMode = isRelifeRoute ? 'relife' : 'shopping';
    
    if (mode !== expectedMode) {
      console.log('Current Route:', location.pathname);
      console.log('Detected Mode:', expectedMode);
      setMode(expectedMode);
    }
  }, [location.pathname, mode, setMode]);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const searchContainerRef = useRef(null);

  // Fetch Notifications
  useEffect(() => {
    if (user) {
      getNotificationsApi().then(data => {
        if (data.success) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter(n => !n.isRead).length);
        }
      }).catch(err => console.error("Failed to fetch notifications", err));
    }
  }, [user]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }
      
      const query = searchQuery.toLowerCase().trim();
      
      searchProducts(query, mode)
        .then(data => {
          let results = mode === 'shopping' ? (data.amazon || []) : (data.relife || []);
          setSearchResults(results.slice(0, 8)); // limit to 8 results
          setHighlightedIndex(-1);
        })
        .catch(err => {
           console.error("Live search failed", err);
           setSearchResults([]);
        });
        
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, mode]);

  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      setIsDropdownOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&mode=${mode}`);
    }
  };

  const navigateToProduct = (item) => {
    saveRecentSearch(searchQuery.trim() || item.name);
    setIsDropdownOpen(false);
    if (mode === 'shopping') {
      navigate(`/product/${item.id}`);
    } else {
      navigate(`/relife/product/${item.id}`);
    }
    setSearchQuery("");
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen) {
      if (e.key === "Enter") handleSearch();
      return;
    }

    const maxIndex = searchQuery.trim() ? searchResults.length - 1 : recentSearches.length - 1;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < maxIndex ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        if (searchQuery.trim()) {
          if (searchResults[highlightedIndex]) {
            navigateToProduct(searchResults[highlightedIndex]);
          }
        } else {
          if (recentSearches[highlightedIndex]) {
            setSearchQuery(recentSearches[highlightedIndex]);
            setIsDropdownOpen(false);
          }
        }
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  const handleModeSwitch = async (targetMode) => {
    if (mode === targetMode) return;

    if (targetMode === 'relife') {
      if (location.pathname.startsWith('/product/')) {
        const id = location.pathname.split('/')[2];
        try {
          const alternative = await getRecommendation(id);
          if (alternative && alternative.product) {
            navigate(`/relife/product/${alternative.product._id || alternative.product.id}`, { state: { recommendedUnitId: alternative.unit.unitId } });
          } else {
            navigate('/relife');
          }
        } catch(e) { navigate('/relife'); }
      } else {
        navigate('/relife');
      }
    } else {
      if (location.pathname.startsWith('/relife/product/')) {
        const id = location.pathname.split('/')[3];
        try {
           const rp = await getRelifeProduct(id);
           if (rp && rp.originalId) {
              navigate(`/product/${rp.originalId}`);
           } else {
              navigate('/');
           }
        } catch(e) { navigate('/'); }
      } else {
        navigate('/');
      }
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await markNotificationReadApi(notif._id);
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
    setShowNotificationsMenu(false);
    if (notif.relatedItemId) {
      navigate(`/relife/product/${notif.relatedItemId}`);
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Tier (Dark Navy) */}
      <div className="bg-[#131921] text-white flex items-center px-4 py-2 space-x-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center border border-transparent hover:border-white p-1 rounded-sm mt-1">
          {mode === 'shopping' ? (
            <div className="flex items-end">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-7 w-auto object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              <span className="text-white font-medium text-sm mb-1 ml-0.5">.in</span>
            </div>
          ) : (
            <span className="text-2xl font-extrabold tracking-tight leading-none text-white">Amazon <span className="text-[#16a34a]">ReLife</span></span>
          )}
        </Link>

        {/* Location Selector */}
        <div className="hidden sm:flex flex-col border border-transparent hover:border-white p-1 rounded-sm cursor-pointer">
          <span className="text-[#cccccc] text-xs leading-none ml-4">Delivering to Patna 800020</span>
          <div className="flex items-center font-bold text-sm">
            <MapPin className="w-4 h-4 mr-0.5" />
            <span>Update location</span>
          </div>
        </div>

        {/* Search Bar Container */}
        <div ref={searchContainerRef} className="flex-1 hidden md:flex flex-col relative">
          <div className="flex items-center h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#FF9900]">
            <div className="bg-gray-100 text-gray-700 text-xs flex items-center px-2 py-3 border-r border-gray-300 cursor-pointer hover:bg-gray-200">
              All <ChevronDown className="w-3 h-3 ml-1" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-full px-4 text-black outline-none" 
              placeholder={mode === 'shopping' ? 'Search Amazon Products' : 'Search ReLife Products, Open Box, Refurbished Items'}
            />
            <button 
              onClick={handleSearch}
              className="bg-[#F3A847] hover:bg-[#e39c42] px-4 h-full flex items-center justify-center transition-colors"
            >
              <Search className="w-6 h-6 text-[#111111]" />
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
              {!searchQuery.trim() ? (
                // Recent Searches
                recentSearches.length > 0 ? (
                  <div className="py-2">
                    <div className="px-4 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Searches</div>
                    {recentSearches.map((term, index) => (
                      <div 
                        key={index}
                        onClick={() => {
                          setSearchQuery(term);
                          setIsDropdownOpen(false);
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`flex items-center px-4 py-2 cursor-pointer text-sm text-black ${highlightedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      >
                        <Clock className="w-4 h-4 mr-3 text-gray-400" />
                        <span>{term}</span>
                      </div>
                    ))}
                  </div>
                ) : null
              ) : searchResults.length > 0 ? (
                // Search Results
                <div className="py-2">
                  {searchResults.map((item, index) => (
                    <div 
                      key={item.id}
                      onClick={() => navigateToProduct(item)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`flex items-center px-4 py-2 cursor-pointer border-b last:border-b-0 border-gray-100 ${highlightedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                    >
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded mr-3" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">{item.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          <span className="capitalize">{item.category}</span>
                          {item.brand && ` • ${item.brand}`}
                          {mode === 'relife' && (
                            <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-800 text-[10px] rounded font-bold">
                              {item.conditionScore ? 'Used' : 'Open Box'}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // No Results
                <div className="px-4 py-6 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No products found for "{searchQuery}"</p>
                  <p className="text-xs mt-1">Try checking your spelling or use more general terms</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Language */}
        <div className="hidden lg:flex items-center border border-transparent hover:border-white p-2 rounded-sm cursor-pointer font-bold text-sm">
          🇮🇳 EN <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />
        </div>

        {/* Notifications */}
        {user && (
          <div 
            className="hidden lg:flex flex-col border border-transparent hover:border-white p-1 rounded-sm cursor-pointer relative"
            onMouseEnter={() => setShowNotificationsMenu(true)}
            onMouseLeave={() => setShowNotificationsMenu(false)}
          >
            <div className="relative flex flex-col items-center justify-center h-full px-2">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C40000] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            
            {showNotificationsMenu && (
              <div className="absolute top-10 right-0 w-80 bg-white text-black rounded-sm shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex justify-between items-center">
                  <h3 className="font-bold text-[#111]">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif._id} 
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${!notif.isRead ? 'bg-[#f0f8ff]' : ''}`}
                      >
                        <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-[#111]' : 'text-gray-700'}`}>{notif.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Account & Lists */}
        <div 
          className="hidden lg:flex flex-col border border-transparent hover:border-white p-1 rounded-sm cursor-pointer relative"
          onMouseEnter={() => setShowAccountMenu(true)}
          onMouseLeave={() => setShowAccountMenu(false)}
        >
          <span className="text-[11px] leading-none">
            {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
          </span>
          <div className="flex items-center font-bold text-sm">
            Account & Lists <ChevronDown className="w-3 h-3 ml-0.5 text-gray-400" />
          </div>
          
          {/* Dropdown Menu */}
          {showAccountMenu && (
            <div className="absolute top-10 right-0 w-64 bg-white text-black rounded-sm shadow-xl border border-gray-200 z-50 p-4">
              {!user ? (
                <div className="text-center pb-4 border-b border-gray-200 mb-2">
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-48 bg-[#f0c14b] border border-[#a88734] hover:bg-[#f4d078] rounded py-1.5 text-sm text-[#111] shadow-sm mb-1"
                  >
                    Sign in
                  </button>
                  <p className="text-[11px] mt-1">New customer? <Link to="/signup" className="text-[#0066c0] hover:underline">Start here.</Link></p>
                </div>
              ) : (
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 mb-2">
                  <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border border-gray-200" />
                  <div>
                    <p className="text-sm font-bold truncate w-40">{user.name}</p>
                    <p className="text-[11px] text-[#16a34a] font-bold flex items-center">
                      <Leaf className="w-3 h-3 mr-1" /> {user.greenCredits || 0} Credits
                    </p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-2 text-[13px]">
                <h3 className="font-bold text-[#111111] mt-2 mb-1">Your Account</h3>
                <Link to="/profile" className="hover:text-[#e77600] hover:underline cursor-pointer py-0.5">Your Profile</Link>
                <Link to="/profile" state={{ tab: 'purchases' }} className="hover:text-[#e77600] hover:underline cursor-pointer py-0.5">Your Orders</Link>
                <Link to="/profile" className="hover:text-[#e77600] hover:underline cursor-pointer py-0.5">My Listings</Link>
                <Link to="/leaderboard" className="hover:text-[#e77600] hover:underline cursor-pointer py-0.5 flex items-center justify-between">
                  <span>Community Leaderboard</span>
                  <span className="bg-[#16a34a] text-white text-[10px] px-1.5 rounded">NEW</span>
                </Link>
                <Link to="/profile" className="hover:text-[#e77600] hover:underline cursor-pointer py-0.5">Your Green Credits</Link>
                {user && (
                  <button 
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="text-left hover:text-[#e77600] hover:underline cursor-pointer py-0.5 mt-2 border-t border-gray-200 pt-2"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Returns & Orders */}
        <Link to="/profile" state={{ tab: 'purchases' }} className="hidden lg:flex flex-col border border-transparent hover:border-white p-1 rounded-sm cursor-pointer">
          <span className="text-[11px] leading-none">Returns</span>
          <span className="font-bold text-sm">& Orders</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="flex items-center border border-transparent hover:border-white p-1 rounded-sm cursor-pointer relative">
          <ShoppingCart className="w-8 h-8" />
          <span className="absolute top-0 left-4 text-[#F3A847] font-bold text-sm bg-[#131921] px-1 rounded-full">{cartCount}</span>
          <span className="font-bold text-sm mt-3 ml-1 hidden sm:block">Cart</span>
        </Link>
      </div>

      {/* Second Tier (Dynamic based on mode) */}
      <div className={`text-white flex flex-wrap items-center px-4 py-1 text-sm ${mode === 'shopping' ? 'bg-[#232F3E]' : 'bg-[#183a31] border-b-2 border-[#16a34a]'}`}>
        
        {/* Amazon Category Links - ONLY IN SHOPPING MODE */}
        {mode === 'shopping' && (
          <>
            <div className="flex items-center border border-transparent hover:border-white p-1 rounded-sm cursor-pointer font-bold mr-4">
              <Menu className="w-5 h-5 mr-1" /> All
            </div>
            <div className="hidden md:flex space-x-1 mr-auto overflow-hidden font-medium">
              {['Fresh', 'MX Player', 'Sell', 'Bestsellers', 'Today\'s Deals', 'Mobiles', 'Prime', 'New Releases', 'Customer Service', 'Electronics', 'Amazon Pay'].map((link) => (
                <span key={link} className="border border-transparent hover:border-white p-1 px-2 rounded-sm cursor-pointer whitespace-nowrap">
                  {link} {link === 'Prime' && <ChevronDown className="w-3 h-3 inline text-gray-400" />}
                </span>
              ))}
            </div>
          </>
        )}

        {/* ReLife Navigation - ONLY IN RELIFE MODE */}
        {mode === 'relife' && (
          <div className="flex items-center space-x-1 mr-auto font-bold text-[#FF9900]">
            <Link to="/relife" className={`px-3 py-1 rounded-sm transition-colors border-b-2 ${location.pathname === '/relife' ? 'border-[#FF9900] text-white' : 'border-transparent hover:border-white hover:text-white'}`}>ReLife Home</Link>
            <div className="relative group">
              <div className={`px-3 py-1 rounded-sm transition-colors border-b-2 cursor-pointer flex items-center ${location.pathname.startsWith('/reseller') ? 'border-[#FF9900] text-white' : 'border-transparent hover:border-white hover:text-white'}`}>
                ReLife Reseller <ChevronDown className="w-3 h-3 ml-1" />
              </div>
              <div className="absolute top-full left-0 w-48 bg-white text-black rounded-sm shadow-xl border border-gray-200 z-50 py-2 hidden group-hover:block">
                <Link to="/reseller" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#e77600]">My Products</Link>
                <Link to="/reseller/listings" className="block px-4 py-2 text-sm hover:bg-gray-100 hover:text-[#e77600]">My Listings</Link>
              </div>
            </div>
            <Link to="/relife/marketplace" className={`px-3 py-1 rounded-sm transition-colors border-b-2 ${location.pathname === '/relife/marketplace' ? 'border-[#FF9900] text-white' : 'border-transparent hover:border-white hover:text-white'}`}>Marketplace</Link>
            <Link to="/relife/openbox" className={`px-3 py-1 rounded-sm transition-colors border-b-2 ${location.pathname === '/relife/openbox' ? 'border-[#FF9900] text-white' : 'border-transparent hover:border-white hover:text-white'}`}>Open Box</Link>
            <Link to="/relife/passports" className={`px-3 py-1 rounded-sm transition-colors border-b-2 ${location.pathname === '/relife/passports' ? 'border-[#FF9900] text-white' : 'border-transparent hover:border-white hover:text-white'}`}>Digital Passports</Link>
            <Link to="/relife/credits" className={`px-3 py-1 rounded-sm transition-colors border-b-2 ${location.pathname === '/relife/credits' ? 'border-[#FF9900] text-white' : 'border-transparent hover:border-white hover:text-white'}`}>Green Credits</Link>
            <Link to="/leaderboard" className={`px-3 py-1 rounded-sm transition-colors border-b-2 ${location.pathname.startsWith('/leaderboard') ? 'border-[#FF9900] text-white' : 'border-transparent hover:border-white hover:text-white'}`}>Leaderboard</Link>
          </div>
        )}

        {/* RE-LIFE MODE SWITCHER (Most Prominent Feature - Always Visible) */}
        <div className="flex items-center ml-auto">
          <div className="flex items-center bg-[#131921] rounded-full p-1 border border-gray-600 shadow-inner overflow-hidden">
            <button 
              onClick={() => handleModeSwitch('shopping')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all flex items-center ${mode === 'shopping' ? 'bg-[#FF9900] text-black shadow-md' : 'text-gray-300 hover:text-white'}`}
            >
              <ShoppingCart className="w-4 h-4 mr-1.5" />
              Amazon Mode
            </button>
            <button 
              onClick={() => handleModeSwitch('relife')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all flex items-center ${mode === 'relife' ? 'bg-[#16a34a] text-white shadow-md' : 'text-gray-300 hover:text-white'}`}
            >
              <Leaf className="w-4 h-4 mr-1.5" />
              ReLife Mode
            </button>
          </div>
        </div>

      </div>
    </header>
  );
}
