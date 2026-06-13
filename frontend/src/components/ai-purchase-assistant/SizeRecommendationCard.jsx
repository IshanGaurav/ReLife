import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function SizeRecommendationCard({ recommendation }) {
  if (!recommendation) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#14b8a6]/10 to-transparent border border-[#14b8a6]/30 rounded-xl p-5 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-[#14b8a6]"></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-[#14b8a6]/20 rounded-lg mr-3">
            <Sparkles className="w-5 h-5 text-[#14b8a6]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">AI Recommendation</h3>
            <p className="text-xl font-bold text-gray-900">{recommendation.recommendedSize}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-gray-500 uppercase">Confidence</span>
          <span className="text-lg font-black text-[#14b8a6]">{recommendation.confidence}%</span>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-700 border border-gray-100 flex items-start">
        <CheckCircle2 className="w-5 h-5 text-[#14b8a6] flex-shrink-0 mr-2 mt-0.5" />
        <p><strong>Why:</strong> {recommendation.reasoning}</p>
      </div>
    </motion.div>
  );
}
