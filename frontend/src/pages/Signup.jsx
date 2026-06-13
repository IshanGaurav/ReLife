import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    
    // Simulate signup
    const success = signup(name, email, password);
    if (success) {
      navigate('/profile');
    } else {
      setError('Error creating account');
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
        <h1 className="text-[28px] font-normal mb-4 text-[#111111]">Create Account</h1>
        
        {error && (
          <div className="text-[#C40000] text-sm mb-4 font-bold flex items-center">
            <span>!</span> <span className="ml-2">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[13px] font-bold text-[#111111] mb-1">Your name</label>
            <input 
              type="text" 
              placeholder="First and last name"
              className="w-full border border-[#a6a6a6] rounded py-1 px-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none shadow-inner text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-[13px] font-bold text-[#111111] mb-1">Mobile number or email</label>
            <input 
              type="email" 
              className="w-full border border-[#a6a6a6] rounded py-1 px-2 focus:ring-2 focus:ring-[#e77600] focus:border-[#e77600] outline-none shadow-inner"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
            <div className="text-xs text-[#111] flex items-center">
              <span className="text-[#0066c0] mr-1">i</span> Passwords must be at least 6 characters.
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#f0c14b] border border-[#a88734] hover:bg-[#f4d078] rounded py-1 text-sm text-[#111] shadow-sm mb-4 mt-2"
          >
            Verify email
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
