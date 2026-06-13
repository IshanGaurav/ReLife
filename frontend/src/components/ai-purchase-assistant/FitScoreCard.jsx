import React from 'react';
import { motion } from 'framer-motion';

export default function FitScoreCard({ recommendation }) {
  if (!recommendation) return null;

  const score = recommendation.fitScore;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between"
    >
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Fit Score</h3>
        <p className="text-sm font-medium text-gray-700">Type: <span className="font-bold text-gray-900">{recommendation.profileSnippet.preferredFit}</span></p>
        <p className="text-xs text-gray-500 mt-1">Expected Outcome: Comfortable Fit</p>
      </div>

      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="transform -rotate-90 w-20 h-20">
          <circle cx="40" cy="40" r={radius} stroke="#f3f4f6" strokeWidth="6" fill="none" />
          <motion.circle 
            cx="40" cy="40" r={radius} 
            stroke="#14b8a6" 
            strokeWidth="6" fill="none" 
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-lg font-black text-gray-900 leading-none">{score}%</span>
        </div>
      </div>
    </motion.div>
  );
}
