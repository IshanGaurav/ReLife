import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Search, 
  MessageSquare, 
  Activity, 
  Lightbulb, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export default function SellerSidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/seller/dashboard' },
    { name: 'Products', icon: Package, path: '/seller/products' },
    { name: 'SEO Optimizer', icon: Search, path: '/seller/seo' },
    { name: 'Review Intelligence', icon: MessageSquare, path: '/seller/reviews' },
    { name: 'Competitor Analysis', icon: Activity, path: '/seller/competitors' },
    { name: 'AI Recommendations', icon: Lightbulb, path: '/seller/recommendations' },
    { name: 'Settings', icon: Settings, path: '/seller/settings' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0F1111] text-white">
      {/* Logo Area */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className={`flex items-center overflow-hidden whitespace-nowrap transition-all ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <span className="font-bold text-xl tracking-tight">Seller <span className="text-[#14b8a6]">Copilot</span></span>
        </div>
        
        {/* Only show collapse button on desktop */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {/* Mobile close button */}
        <button 
          onClick={() => setMobileOpen(false)}
          className="md:hidden flex p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto space-y-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `
              flex items-center px-3 py-2.5 rounded-lg transition-all group
              ${isActive 
                ? 'bg-[#14b8a6]/10 text-[#14b8a6]' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
              }
            `}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
            <span className={`font-medium whitespace-nowrap transition-all duration-300 ${collapsed ? 'hidden' : 'block'}`}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* User Area */}
      <div className="p-4 border-t border-gray-800 flex items-center">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#14b8a6] to-teal-600 flex items-center justify-center font-bold text-white flex-shrink-0">
          {user?.name?.charAt(0)?.toUpperCase() || 'S'}
        </div>
        <div className={`ml-3 overflow-hidden transition-all duration-300 ${collapsed ? 'hidden' : 'block'}`}>
          <p className="text-sm font-medium text-white truncate">{user?.businessName || user?.name || 'Seller'}</p>
          <p className="text-xs text-gray-400 truncate capitalize">{user?.role || 'Seller'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button (Visible only when sidebar is hidden on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0F1111] z-40 flex items-center px-4 justify-between border-b border-gray-800">
        <span className="font-bold text-lg text-white">Seller <span className="text-[#14b8a6]">Copilot</span></span>
        <button 
          onClick={() => setMobileOpen(true)}
          className="p-2 text-gray-300 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside 
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col sticky top-0 h-screen z-40 bg-[#0F1111]"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="md:hidden fixed inset-y-0 left-0 w-64 z-50 bg-[#0F1111]"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
