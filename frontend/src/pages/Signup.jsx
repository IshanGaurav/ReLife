import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, ShoppingCart, BarChart, Loader2 } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');

    const res = await signup(name, email, password, role);
    
    setIsLoading(false);

    if (res.success) {
      if (res.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 bg-white min-h-[calc(100vh-200px)] animate-fade-in pb-12">
      <Link to="/" className="mb-4">
        <div className="text-3xl font-extrabold tracking-tight text-[#111111] flex items-center">
          amazon <Leaf className="w-6 h-6 text-[#16a34a] ml-1" />
        </div>
      </Link>
      
      {/* Role Selection */}
      <div className="w-[350px] mb-6">
        <h2 className="text-[13px] font-bold text-gray-700 mb-2">I want to register as a:</h2>
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => !isLoading && setRole('customer')}
            className={`cursor-pointer rounded border p-3 flex flex-col items-center text-center transition-all ${role === 'customer' ? 'border-[#e77600] bg-[#fffaf5] shadow-sm ring-1 ring-[#e77600]' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <div className={`p-2 rounded-full mb-1 ${role === 'customer' ? 'bg-[#FF9900] text-white' : 'bg-gray-200 text-gray-500'}`}>
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h3 className={`font-bold text-[13px] ${role === 'customer' ? 'text-[#111]' : 'text-gray-600'}`}>Customer</h3>
          </div>
          
          <div 
            onClick={() => !isLoading && setRole('seller')}
            className={`cursor-pointer rounded border p-3 flex flex-col items-center text-center transition-all ${role === 'seller' ? 'border-[#0066c0] bg-[#f0f8ff] shadow-sm ring-1 ring-[#0066c0]' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <div className={`p-2 rounded-full mb-1 ${role === 'seller' ? 'bg-[#0066c0] text-white' : 'bg-gray-200 text-gray-500'}`}>
              <BarChart className="w-5 h-5" />
            </div>
            <h3 className={`font-bold text-[13px] ${role === 'seller' ? 'text-[#111]' : 'text-gray-600'}`}>Seller</h3>
          </div>
        </div>
      </div>

      <div className="w-[350px] border border-[#D5D9D9] rounded p-6 shadow-sm">
        <h1 className="text-[28px] font-normal mb-4 text-[#111111]">Create Account</h1>
        
        {error && (
          <div className="text-[#C40000] text-sm mb-4 font-bold flex items-center">
            <span>!</span> <span className="ml-2">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[13px] font-bold text-[#111111] mb-1">Your name {role === 'seller' ? '(Business Name)' : ''}</label>
            <input 
              type="text" 
              placeholder={role === 'seller' ? "Business Name" : "First and last name"}
              className="w-full border border-[#a6a6a6] rounded py-1 px-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none shadow-inner text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-[13px] font-bold text-[#111111] mb-1">Email</label>
            <input 
              type="email" 
              className="w-full border border-[#a6a6a6] rounded py-1 px-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none shadow-inner text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-[13px] font-bold text-[#111111] mb-1">Password</label>
            <input 
              type="password" 
              placeholder="At least 6 characters"
              className="w-full border border-[#a6a6a6] rounded py-1 px-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none shadow-inner text-sm mb-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <div className="text-xs text-[#111] flex items-center">
              <span className="text-[#0066c0] mr-1">i</span> Passwords must be at least 6 characters.
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-[13px] font-bold text-[#111111] mb-1">Re-enter password</label>
            <input 
              type="password" 
              className="w-full border border-[#a6a6a6] rounded py-1 px-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none shadow-inner text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full flex items-center justify-center border hover:bg-[#f4d078] rounded py-1.5 text-sm text-[#111] shadow-sm mb-4 ${isLoading ? 'bg-[#f4d078] border-[#a88734] opacity-70 cursor-not-allowed' : 'bg-[#f0c14b] border-[#a88734]'}`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-[#111]" /> : 'Create your Amazon account'}
          </button>
        </form>

        <p className="text-[12px] text-[#111111] leading-relaxed mb-6 pt-4 border-t border-[#D5D9D9]">
          By creating an account, you agree to Amazon's <a href="#" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Conditions of Use</a> and <a href="#" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Privacy Notice</a>.
        </p>

        <div className="text-[13px] text-[#111111]">
          Already have an account? <Link to="/login" className="text-[#0066c0] hover:text-[#c45500] hover:underline">Sign in <span className="text-xs">►</span></Link>
        </div>
      </div>
    </div>
  );
}
