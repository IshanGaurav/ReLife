import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export default function ReLifeCarbonImpact({ co2Saved }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="text-sm text-[#007185] font-medium flex items-center p-1 -ml-1 rounded-md cursor-default"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={{
        textShadow: isHovered ? '0px 0px 8px rgba(22, 163, 74, 0.4)' : 'none',
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{
          rotate: isHovered ? [0, -15, 15, -10, 10, 0] : 0,
          scale: isHovered ? 1.2 : 1
        }}
        transition={{ duration: 0.6 }}
      >
        <Leaf className="w-4 h-4 mr-1 text-[#16a34a]" />
      </motion.div>
      <span>Buying this ReLife product saves {co2Saved || '15 kg'} CO₂.</span>
    </motion.div>
  );
}
