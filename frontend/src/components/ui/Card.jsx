import React from 'react';

export default function Card({ children, className = '', noPadding = false, hover = false }) {
  const paddingClass = noPadding ? '' : 'p-6';
  const hoverClass = hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : '';
  
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${paddingClass} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}
