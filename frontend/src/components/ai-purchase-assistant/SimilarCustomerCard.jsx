import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function SimilarCustomerCard({ recommendation }) {
  if (!recommendation) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white border border-gray-200 rounded-xl p-5"
    >
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3">
          <Users className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-gray-900">People Similar To You</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 uppercase font-bold mb-1">Height</div>
          <div className="text-sm font-medium text-gray-900">{recommendation.profileSnippet.height} cm</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-xs text-gray-500 uppercase font-bold mb-1">Weight</div>
          <div className="text-sm font-medium text-gray-900">{recommendation.profileSnippet.weight} kg</div>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-3 mt-3">
        <span className="text-gray-600">Most Purchased Size:</span>
        <span className="font-bold text-gray-900">{recommendation.recommendedSize}</span>
      </div>
      <div className="flex justify-between items-center text-sm mt-2">
        <span className="text-gray-600">Successful Purchase Rate:</span>
        <span className="font-bold text-green-600">{recommendation.similarCustomerSuccess}%</span>
      </div>
    </motion.div>
  );
}
