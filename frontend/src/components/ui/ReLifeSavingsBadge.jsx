import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function ReLifeSavingsBadge({ savings }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-[#16a34a] text-white px-3 py-1 rounded-sm text-sm font-bold flex items-center cursor-default origin-left"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={
        isHovered
          ? { scale: 1.05, backgroundColor: '#15803d', boxShadow: '0px 0px 10px rgba(22, 163, 74, 0.8)' }
          : { scale: [1, 1.02, 1], boxShadow: 'none' }
      }
      transition={
        isHovered 
          ? { duration: 0.2 } 
          : { duration: 2, repeat: Infinity, ease: "easeInOut" }
      }
    >
      Save ₹{savings}
    </motion.div>
  );
}
