import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Enter your email or mobile phone number');
      return;
    }
    
    // Simulate login
    const success = login(email, password);
    if (success) {
      navigate('/profile');
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
      
      <div className="w-[350px] border border-[#D5D9D9] rounded p-6 shadow-sm">
        <h1 className="text-[28px] font-normal mb-4 text-[#111111]">Sign in</h1>
        
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
