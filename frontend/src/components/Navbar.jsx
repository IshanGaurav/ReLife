import React, { useState } from 'react';
import { Search, ShoppingCart, MapPin, Menu, ChevronDown, Leaf, User } from 'lucide-react';
import { useMode } from '../context/ModeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getRelifeAlternative, getAmazonAlternative } from '../utils/productMatcher';

export default function Navbar() {
  const { mode, toggleMode } = useMode();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleModeSwitch = (targetMode) => {
    if (mode === targetMode) return;

    if (targetMode === 'relife') {
      if (location.pathname.startsWith('/product/')) {
        const id = location.pathname.split('/')[2];
        const alternative = getRelifeAlternative(id);
        if (alternative) {
          navigate(`/relife/product/${alternative.id}`);
        } else {
          navigate('/relife');
        }
      } else {
        navigate('/relife');
      }
    } else {
      if (location.pathname.startsWith('/relife/product/')) {
        const id = location.pathname.split('/')[3];
        const alternative = getAmazonAlternative(id);
        if (alternative) {
          navigate(`/product/${alternative.id}`);
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }
    toggleMode();
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Tier (Dark Navy) */}
      <div className="bg-[#131921] text-white flex items-center px-4 py-2 space-x-4">
        
        {/* Logo */}
        <Link to="/" className="flex flex-col justify-center border border-transparent hover:border-white p-1 rounded-sm mt-1">
          {mode === 'shopping' ? (
            <span className="text-2xl font-extrabold tracking-tight leading-none">amazon<span className="text-[#FF9900]">.in</span></span>
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

        {/* Search Bar */}
        <div className="flex-1 hidden md:flex items-center h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#FF9900]">
          <div className="bg-gray-100 text-gray-700 text-xs flex items-center px-2 py-3 border-r border-gray-300 cursor-pointer hover:bg-gray-200">
            All <ChevronDown className="w-3 h-3 ml-1" />
          </div>
          <input 
            type="text" 
            className="flex-1 h-full px-4 text-black outline-none" 
            placeholder={mode === 'shopping' ? 'Search Amazon.in' : 'Search ReLife Products, Open Box, Refurbished Items'}
          />
          <button className="bg-[#F3A847] hover:bg-[#e39c42] px-4 h-full flex items-center justify-center transition-colors">
            <Search className="w-6 h-6 text-[#111111]" />
          </button>
        </div>

        {/* Language */}
        <div className="hidden lg:flex items-center border border-transparent hover:border-white p-2 rounded-sm cursor-pointer font-bold text-sm">
          🇮🇳 EN <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />
        </div>

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
                      <Leaf className="w-3 h-3 mr-1" /> {user.credits} Credits
                    </p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-2 text-[13px]">
                <h3 className="font-bold text-[#111111] mt-2 mb-1">Your Account</h3>
                <Link to="/profile" className="hover:text-[#e77600] hover:underline cursor-pointer py-0.5">Your Profile</Link>
                <Link to="/profile" className="hover:text-[#e77600] hover:underline cursor-pointer py-0.5">Your Orders</Link>
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
        <div className="hidden lg:flex flex-col border border-transparent hover:border-white p-1 rounded-sm cursor-pointer">
          <span className="text-[11px] leading-none">Returns</span>
          <span className="font-bold text-sm">& Orders</span>
        </div>

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
            <Link to="/relife/sell" className={`px-3 py-1 rounded-sm transition-colors border-b-2 ${location.pathname === '/relife/sell' ? 'border-[#FF9900] text-white' : 'border-transparent hover:border-white hover:text-white'}`}>Sell an Item</Link>
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
