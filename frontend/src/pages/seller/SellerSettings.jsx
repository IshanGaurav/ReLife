import React from 'react';
import { User, Bell, Shield, Key, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SellerSettings() {
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences and integrations.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Settings Nav */}
          <div className="w-full md:w-64 bg-gray-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg bg-white border border-gray-200 text-[#14b8a6] shadow-sm">
                <User className="w-4 h-4 mr-3" /> Profile
              </a>
              <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100">
                <Bell className="w-4 h-4 mr-3" /> Notifications
              </a>
              <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100">
                <Shield className="w-4 h-4 mr-3" /> AI Preferences
              </a>
              <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100">
                <Key className="w-4 h-4 mr-3" /> API Keys
              </a>
              <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100">
                <Moon className="w-4 h-4 mr-3" /> Theme
              </a>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                  <input type="text" defaultValue={user?.businessName || user?.name || ''} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#14b8a6]/50 focus:border-[#14b8a6] outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seller ID</label>
                  <input type="text" defaultValue="A1B2C3D4E5F6" disabled className="w-full p-2.5 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg text-sm outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" defaultValue={user?.email || ''} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#14b8a6]/50 focus:border-[#14b8a6] outline-none" />
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button type="button" className="px-6 py-2.5 bg-[#14b8a6] hover:bg-teal-600 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
