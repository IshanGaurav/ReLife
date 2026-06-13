import React from 'react';

export default function Badge({ children, variant = 'gray', className = '' }) {
  const variants = {
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    green: 'bg-relife-light-green text-relife-green border-green-200',
    orange: 'bg-orange-100 text-amazon-orange-hover border-orange-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${variants[variant]} uppercase tracking-wider ${className}`}>
      {children}
    </span>
  );
}
