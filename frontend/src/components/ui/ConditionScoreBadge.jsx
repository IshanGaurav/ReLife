import React from 'react';

export default function ConditionScoreBadge({ score }) {
  let colorClass = '';
  let label = '';
  
  const numScore = parseInt(score, 10) || 0;

  if (numScore >= 95) {
    colorClass = 'text-green-800 bg-green-100 border-green-300';
    label = 'Excellent';
  } else if (numScore >= 85) {
    colorClass = 'text-[#16a34a] bg-[#EFFFF3] border-[#B8E2C4]';
    label = 'Very Good';
  } else if (numScore >= 70) {
    colorClass = 'text-yellow-700 bg-yellow-50 border-yellow-300';
    label = 'Good';
  } else if (numScore >= 50) {
    colorClass = 'text-orange-700 bg-orange-50 border-orange-300';
    label = 'Fair';
  } else {
    colorClass = 'text-red-700 bg-red-50 border-red-300';
    label = 'Poor';
  }

  // Calculate progress bar ticks (10 ticks total)
  const filledTicks = Math.round(numScore / 10);
  
  return (
    <div className={`flex flex-col items-start px-2 py-1 rounded border ${colorClass} w-full`}>
      <div className="flex justify-between w-full items-center mb-1">
        <span className="text-[10px] font-extrabold uppercase tracking-wide opacity-80">{label}</span>
        <span className="text-xs font-black">{numScore}/100</span>
      </div>
      <div className="flex space-x-[1px] w-full h-1.5 opacity-90">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-sm ${i < filledTicks ? 'bg-current' : 'bg-current opacity-20'}`}
          />
        ))}
      </div>
    </div>
  );
}
