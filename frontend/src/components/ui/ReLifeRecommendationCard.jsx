import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, ShieldCheck, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMode } from '../../context/ModeContext';
import ReLifeBenefitsPopover from './ReLifeBenefitsPopover';
import ReLifeSavingsBadge from './ReLifeSavingsBadge';
import ReLifeCarbonImpact from './ReLifeCarbonImpact';

export default function ReLifeRecommendationCard({ recommendation, amazonProduct }) {
  const navigate = useNavigate();
  const { setMode } = useMode();
  const [isHovered, setIsHovered] = useState(false);

  const calculateSavings = (amazonPrice, relifePrice) => {
    try {
      const aPrice = parseFloat(amazonPrice.replace(/,/g, ''));
      const rPrice = parseFloat(relifePrice.replace(/,/g, ''));
      if (aPrice && rPrice) {
        return (aPrice - rPrice).toLocaleString('en-IN');
      }
    } catch(e) {}
    return '0';
  };

  const { product, unit } = recommendation;
  const savings = calculateSavings(amazonProduct.price, unit.price);

  return (
    <div 
      className="my-4 relative z-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ReLifeBenefitsPopover isOpen={isHovered}>
        <motion.div
          className="bg-[#EFFFF3] rounded-xl p-5 relative overflow-hidden cursor-pointer"
          animate={{
            y: isHovered ? -6 : 0,
            scale: isHovered ? 1.02 : 1,
            boxShadow: isHovered 
              ? '0 10px 25px -5px rgba(22, 163, 74, 0.2), 0 8px 10px -6px rgba(22, 163, 74, 0.1)' 
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
            borderColor: isHovered ? '#4ade80' : '#B8E2C4',
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ border: '1px solid #B8E2C4' }}
        >
          {/* Animated Glow Border using Gradient Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.05), transparent, rgba(34, 197, 94, 0.05))',
                  border: '1px solid rgba(74, 222, 128, 0.6)',
                  zIndex: 2
                }}
              />
            )}
          </AnimatePresence>

          {/* Background blurred glow */}
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#16a34a] rounded-full blur-[50px] opacity-20 pointer-events-none z-0"></div>
          
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center">
              <Recycle className="w-5 h-5 text-[#16a34a] mr-2" />
              <h3 className="font-bold text-[#16a34a] text-lg">ReLife Alternative Available</h3>
            </div>
            {/* Mobile Info Button (Since Popover is Desktop Only) */}
            <div className="md:hidden">
              <button 
                className="p-1.5 rounded-full bg-white/60 hover:bg-white text-[#565959] shadow-sm transition-colors" 
                aria-label="Why choose ReLife?"
                onClick={(e) => {
                  e.stopPropagation();
                  alert("Quality Checked\nEnvironmental Impact\nDigital Passport\nTrusted & Secure\nSmart Savings");
                }}
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Green Score Badge */}
          {unit.calculatedMetrics && (
            <div className="mb-3 relative z-10 flex items-center bg-[#FF9900] text-[#0F1111] px-3 py-1.5 rounded-md w-max shadow-sm border border-[#e77600]">
              <span className="mr-2 text-sm">🏆</span>
              <span className="font-bold text-sm">Best Available Condition</span>
            </div>
          )}

          <h4 className="font-bold text-[#0F1111] text-md mb-3 relative z-10">{product.name}</h4>

          <div className="grid grid-cols-2 gap-3 mb-4 relative z-10 text-sm">
            {unit.calculatedMetrics ? (
              <>
                <div className="bg-white p-2 rounded border border-[#B8E2C4]">
                  <div className="text-xs text-[#565959]">Condition</div>
                  <div className="font-bold text-[#0F1111] text-base">{unit.conditionScore}/100</div>
                </div>
                <div className="bg-white p-2 rounded border border-[#B8E2C4]">
                  <div className="text-xs text-[#565959]">🌱 Green Score</div>
                  <div className="font-bold text-[#16a34a] text-base">{unit.calculatedMetrics.greenScore}/100</div>
                </div>
                <div className="bg-white p-2 rounded border border-[#B8E2C4]">
                  <div className="text-xs text-[#565959]">CO₂ Saved</div>
                  <div className="font-bold text-[#0F1111] text-base">{unit.calculatedMetrics.co2Saved}</div>
                </div>
                <div className="bg-white p-2 rounded border border-[#B8E2C4]">
                  <div className="text-xs text-[#565959]">Life Extension</div>
                  <div className="font-bold text-[#0F1111] text-base">{unit.calculatedMetrics.lifespanExtension}</div>
                </div>
              </>
            ) : (
                <div className="bg-white p-2 rounded border border-[#B8E2C4] col-span-2">
                  <div className="text-xs text-[#565959]">Condition</div>
                  <div className="font-bold text-[#0F1111] text-base">{unit.conditionScore}/100</div>
                </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end mb-5 gap-6 relative z-10">
            <div>
              <div className="text-xs text-[#565959] mb-0.5">Price</div>
              <div className="text-2xl font-bold text-[#B12704] leading-none">₹{unit.price}</div>
            </div>
            <div>
               <div className="text-xs text-[#565959] mb-0.5">Savings</div>
               <div className="text-xl font-bold text-[#16a34a] leading-none">₹{savings}</div>
            </div>
          </div>

          <motion.button 
            onClick={(e) => {
              e.stopPropagation();
              setMode('relife');
              navigate(`/relife/product/${product._id || product.id}`, { state: { recommendedUnitId: unit.id, amazonProduct: amazonProduct } });
            }}
            animate={{
              scale: isHovered ? 1.02 : 1,
              backgroundColor: isHovered ? '#15803d' : '#16a34a',
            }}
            whileTap={{ scale: 0.95 }}
            className="text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md w-full flex items-center justify-center relative z-10 overflow-hidden"
          >
            View ReLife Alternative
            <motion.div
              animate={{ x: isHovered ? 5 : 0, opacity: isHovered ? 1 : 0.8 }}
              className="ml-2 flex items-center"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </motion.div>
      </ReLifeBenefitsPopover>
    </div>
  );
}
