import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SellerLayout from './components/seller/SellerLayout';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerProducts from './pages/seller/SellerProducts';
import SellerSEO from './pages/seller/SellerSEO';
import SellerReviews from './pages/seller/SellerReviews';
import SellerCompetitors from './pages/seller/SellerCompetitors';
import SellerRecommendations from './pages/seller/SellerRecommendations';
import SellerSettings from './pages/seller/SellerSettings';
import ReLifeHome from './pages/ReLifeHome';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Passport from './pages/Passport';
import Credits from './pages/Credits';
import Profile from './pages/Profile';
import FitProfilePage from './pages/profile/FitProfilePage';
import PurchaseAssistantDashboard from './pages/profile/PurchaseAssistantDashboard';
import AmazonHome from './pages/AmazonHome';
import AmazonProductDetails from './pages/AmazonProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Leaderboard from './pages/Leaderboard';
import SearchPage from './pages/SearchPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ModeProvider, useMode } from './context/ModeContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function RootRouter() {
  const { mode } = useMode();
  const location = useLocation();
  const isSellerRoute = location.pathname.startsWith('/seller');
  
  return (
    <div className={`min-h-screen font-sans ${mode === 'shopping' ? 'bg-gray-100' : 'bg-gray-100'}`}>
      {!isSellerRoute && <Navbar />}
      
      <main className={`${!isSellerRoute ? 'max-w-7xl mx-auto py-8 ' : ''}animate-fade-in`}>
        <Routes>
          <Route path="/" element={<AmazonHome />} />
          <Route path="/product/:id" element={<AmazonProductDetails />} />
          
          {/* ReLife Specific Routes */}
          <Route path="/relife" element={<ReLifeHome />} />
          <Route path="/relife/sell" element={<Upload />} />
          <Route path="/relife/marketplace" element={<Marketplace />} />
          <Route path="/relife/openbox" element={<Marketplace />} />
          <Route path="/relife/passports" element={<Marketplace />} />
          <Route path="/relife/product/:id" element={<ProductDetails />} />
          <Route path="/relife/passport/:id" element={<Passport />} />
          <Route path="/relife/credits" element={<Credits />} />
          
          {/* Shared Routes */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/fit-profile" element={<ProtectedRoute><FitProfilePage /></ProtectedRoute>} />
          <Route path="/profile/purchase-assistant" element={<ProtectedRoute><PurchaseAssistantDashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/leaderboard/:period" element={<Leaderboard />} />
          <Route path="/leaderboard" element={<Navigate to="/leaderboard/daily" replace />} />

          {/* Seller Copilot Routes */}
          <Route path="/seller" element={<ProtectedRoute allowedRoles={['seller']}><SellerLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/seller/dashboard" replace />} />
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="seo" element={<SellerSEO />} />
            <Route path="reviews" element={<SellerReviews />} />
            <Route path="competitors" element={<SellerCompetitors />} />
            <Route path="recommendations" element={<SellerRecommendations />} />
            <Route path="settings" element={<SellerSettings />} />
          </Route>

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
