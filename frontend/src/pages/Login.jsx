import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, ShoppingCart, BarChart } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('user');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Enter your email or mobile phone number');
      return;
    }
    // Simulate login
    const success = login(email, password, role);
    if (success) {
      if (role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 bg-white min-h-[calc(100vh-200px)] animate-fade-in">
      <Link to="/" className="mb-4">
        <div className="text-3xl font-extrabold tracking-tight text-[#111111] flex items-center">
          amazon <Leaf className="w-6 h-6 text-[#16a34a] ml-1" />
        </div>
      </Link>
      
      {/* Role Selection Cards */}
      <div className="w-[350px] mb-6">
        <h2 className="text-[13px] font-bold text-gray-700 mb-2">Choose Account Type</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Customer Card */}
          <div 
            onClick={() => setRole('user')}
            className={`cursor-pointer rounded border p-3 flex flex-col items-center text-center transition-all ${role === 'user' ? 'border-[#e77600] bg-[#fffaf5] shadow-sm ring-1 ring-[#e77600]' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <div className={`p-2 rounded-full mb-1 ${role === 'user' ? 'bg-[#FF9900] text-white' : 'bg-gray-200 text-gray-500'}`}>
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h3 className={`font-bold text-[13px] ${role === 'user' ? 'text-[#111]' : 'text-gray-600'}`}>Customer</h3>
          </div>
          
          {/* Seller Card */}
          <div 
            onClick={() => setRole('seller')}
            className={`cursor-pointer rounded border p-3 flex flex-col items-center text-center transition-all relative ${role === 'seller' ? 'border-[#0066c0] bg-[#f0f8ff] shadow-sm ring-1 ring-[#0066c0]' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <div className={`p-2 rounded-full mb-1 ${role === 'seller' ? 'bg-[#0066c0] text-white' : 'bg-gray-200 text-gray-500'}`}>
              <BarChart className="w-5 h-5" />
            </div>
            <h3 className={`font-bold text-[13px] ${role === 'seller' ? 'text-[#111]' : 'text-gray-600'}`}>Seller</h3>
          </div>
        </div>
      </div>
      
      <div className="w-[350px] border border-[#D5D9D9] rounded p-6 shadow-sm">
        <h1 className="text-[28px] font-normal mb-2 text-[#111111]">
          {role === 'user' ? 'Sign in to Amazon ReLife' : 'Sign in to Seller Copilot'}
        </h1>
        <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">
          {role === 'user' 
            ? 'Shop products, access ReLife marketplace, earn Green Credits, manage orders, and use AI Purchase Assistant.' 
            : 'Manage products, optimize listings, and grow your business.'}
        </p>
        
        {error && (
          <div className="text-[#C40000] text-sm mb-4 font-bold flex items-center">
            <span>!</span> <span className="ml-2">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[13px] font-bold text-[#111111] mb-1">Email or mobile phone number</label>
            <input 
              type="email" 
              className="w-full border border-[#a6a6a6] rounded py-1 px-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none shadow-inner"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[13px] font-bold text-[#111111]">Password</label>
              <a href="#" className="text-[#0066c0] hover:text-[#c45500] hover:underline text-[13px]">Forgot Password</a>
            </div>
            <input 
              type="password" 
              className="w-full border border-[#a6a6a6] rounded py-1 px-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none shadow-inner"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#f0c14b] border border-[#a88734] hover:bg-[#f4d078] rounded py-1 text-sm text-[#111] shadow-sm mb-4"
          >
            Continue
          </button>
        </form>

        <p className="text-[12px] text-[#111111] leading-relaxed">
          By continuing, you agree to Amazon's <a href="#" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Conditions of Use</a> and <a href="#" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Privacy Notice</a>.
        </p>
      </div>

      <div className="w-[350px] mt-6 flex items-center mb-4">
        <div className="flex-1 border-t border-[#D5D9D9]"></div>
        <div className="px-3 text-[#767676] text-xs">New to Amazon?</div>
        <div className="flex-1 border-t border-[#D5D9D9]"></div>
      </div>

      <button 
        className="w-[350px] bg-[#e7e9ec] border border-[#adb1b8] hover:bg-[#dfdfdf] rounded py-1 text-sm text-[#111] shadow-sm"
        onClick={() => navigate('/signup')}
      >
        Create your Amazon account
      </button>
    </div>
  );
}
