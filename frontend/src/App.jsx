import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReLifeHome from './pages/ReLifeHome';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Passport from './pages/Passport';
import Credits from './pages/Credits';
import Profile from './pages/Profile';
import AmazonHome from './pages/AmazonHome';
import AmazonProductDetails from './pages/AmazonProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Leaderboard from './pages/Leaderboard';
import { ModeProvider, useMode } from './context/ModeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function RootRouter() {
  const { mode } = useMode();
  
  return (
    <div className={`min-h-screen font-sans ${mode === 'shopping' ? 'bg-gray-100' : 'bg-gray-100'}`}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-8 animate-fade-in">
        <Routes>
          <Route path="/" element={mode === 'shopping' ? <AmazonHome /> : <Navigate to="/relife" replace />} />
          <Route path="/product/:id" element={<AmazonProductDetails />} />
          
          {/* ReLife Specific Routes */}
          <Route path="/relife" element={mode === 'relife' ? <ReLifeHome /> : <Navigate to="/" replace />} />
          <Route path="/relife/sell" element={mode === 'relife' ? <Upload /> : <Navigate to="/" replace />} />
          <Route path="/relife/marketplace" element={mode === 'relife' ? <Marketplace /> : <Navigate to="/" replace />} />
          <Route path="/relife/openbox" element={mode === 'relife' ? <Marketplace /> : <Navigate to="/" replace />} />
          <Route path="/relife/passports" element={mode === 'relife' ? <Marketplace /> : <Navigate to="/" replace />} />
          <Route path="/relife/product/:id" element={<ProductDetails />} />
          <Route path="/relife/passport/:id" element={<Passport />} />
          <Route path="/relife/credits" element={mode === 'relife' ? <Credits /> : <Navigate to="/" replace />} />
          
          {/* Shared Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/leaderboard/:period" element={<Leaderboard />} />
          <Route path="/leaderboard" element={<Navigate to="/leaderboard/daily" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ModeProvider>
          <BrowserRouter>
            <RootRouter />
          </BrowserRouter>
        </ModeProvider>
      </CartProvider>
    </AuthProvider>
  );
}
