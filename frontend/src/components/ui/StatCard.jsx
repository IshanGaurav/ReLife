import React from 'react';
import Card from './Card';

export default function StatCard({ title, value, icon, variant = 'default' }) {
  const variants = {
    default: 'text-gray-900',
    green: 'text-relife-green',
    orange: 'text-amazon-orange',
  };

  const iconVariants = {
    default: 'bg-gray-100 text-gray-500',
    green: 'bg-relife-light-green text-relife-green',
    orange: 'bg-orange-100 text-amazon-orange',
  };

  return (
    <Card hover className="flex flex-col items-center justify-center text-center py-8">
      <div className={`p-4 rounded-full mb-4 ${iconVariants[variant]}`}>
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</h3>
      <p className={`text-4xl font-extrabold ${variants[variant]}`}>{value}</p>
    </Card>
  );
}
