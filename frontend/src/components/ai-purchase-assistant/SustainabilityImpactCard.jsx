import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Truck, PackageX } from 'lucide-react';

export default function SustainabilityImpactCard({ recommendation }) {
  if (!recommendation) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gradient-to-br from-[#007185]/10 to-transparent border border-[#007185]/30 rounded-xl p-5"
    >
      <div className="flex items-center mb-4">
        <div className="p-2 bg-[#007185]/20 text-[#007185] rounded-full mr-3">
          <Leaf className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Estimated Impact</h3>
          <p className="text-xs text-[#007185] font-bold">By selecting the right size:</p>
        </div>
      </div>

      <ul className="space-y-2 mb-4">
        <li className="flex items-center text-xs text-gray-700 font-medium">
          <PackageX className="w-4 h-4 mr-2 text-[#007185]" /> Reduce unnecessary returns
        </li>
        <li className="flex items-center text-xs text-gray-700 font-medium">
          <Truck className="w-4 h-4 mr-2 text-[#007185]" /> Reduce transportation emissions
        </li>
      </ul>

      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 flex justify-between items-center border border-[#007185]/20">
        <span className="text-sm font-bold text-gray-700">Estimated CO₂ Saved:</span>
        <span className="text-lg font-black text-[#007185]">{recommendation.co2Saved}kg</span>
      </div>
    </motion.div>
  );
}
