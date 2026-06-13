import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';

export default function SellerLayout() {
  return (
    <div className="flex min-h-screen bg-[#F3F4F6] text-[#0F1111]">
      <SellerSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Spacer (since mobile has a fixed top bar for the menu button) */}
        <div className="h-14 md:hidden"></div>
        
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
