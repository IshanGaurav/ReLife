import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ChevronRight, X, CheckCircle2, ShieldCheck, AlertTriangle, AlertCircle, Leaf, Users, Ruler } from 'lucide-react';
import { getAIRecommendation } from '../../api/recommendationEngine';
import { useNavigate } from 'react-router-dom';

const Counter = ({ from, to, duration, format = (v) => v }) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * (to - from) + from));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration]);

  return <span>{format(count)}</span>;
};

function DetailedAnalysisModal({ isOpen, onClose, recommendation }) {
  const navigate = useNavigate();

  if (!recommendation) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
          >
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex justify-between items-center z-10">
              <div className="flex items-center text-[#14b8a6]">
                <Sparkles className="w-5 h-5 mr-2" />
                <h2 className="font-bold text-gray-900">AI Purchase Assistant</h2>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              
              {/* Primary Recommendation */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Recommended Size</h3>
                    <p className="text-3xl font-black text-gray-900">{recommendation.recommendedSize}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Confidence</span>
                    <span className="text-2xl font-black text-[#14b8a6]">
                      <Counter from={0} to={recommendation.confidence} duration={1.5} format={v => `${v}%`} />
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 flex items-start border border-gray-100">
                  <CheckCircle2 className="w-5 h-5 text-[#14b8a6] mr-3 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 leading-relaxed">{recommendation.reasoning}</p>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Expected Fit Score</span>
                  <div className="flex items-center">
                    <span className="font-bold text-gray-900 mr-2">{recommendation.fitScore}%</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded font-medium text-gray-700">{recommendation.profileSnippet.preferredFit} Fit</span>
                  </div>
                </div>
              </div>

              {/* Similar Customers */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" /> People Similar To You
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div className="bg-white border border-gray-200 p-3 rounded-lg text-center shadow-sm">
                    <div className="text-xs text-gray-500 font-bold mb-1">Height</div>
                    <div className="text-sm font-bold text-gray-900">{recommendation.profileSnippet.height} cm</div>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-lg text-center shadow-sm">
                    <div className="text-xs text-gray-500 font-bold mb-1">Weight</div>
                    <div className="text-sm font-bold text-gray-900">{recommendation.profileSnippet.weight} kg</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Most Purchased Size:</span>
                  <span className="font-bold text-gray-900">{recommendation.recommendedSize}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Successful Purchase Rate:</span>
                  <span className="font-bold text-green-600">{recommendation.similarCustomerSuccess}%</span>
                </div>
              </div>

              {/* Return Risk */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center">
                  {recommendation.returnRisk === 'Low' && <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />}
                  {recommendation.returnRisk === 'Medium' && <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />}
                  {recommendation.returnRisk === 'High' && <AlertCircle className="w-4 h-4 mr-2 text-red-600" />}
                  Return Risk: {recommendation.returnRisk}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {recommendation.returnRisk !== 'Low' 
                    ? "Based on your purchase history and this product's fit trends, returning an alternative size is higher risk. Selecting our recommended size reduces this risk." 
                    : "You have a high success rate with this fit profile. We expect a great fit!"}
                </p>
              </div>

              {/* Sustainability */}
              <div className="bg-gradient-to-br from-[#007185]/10 to-transparent border border-[#007185]/20 rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-[#007185] flex items-center">
                  <Leaf className="w-4 h-4 mr-2" /> Sustainability Impact
                </h3>
                <p className="text-xs text-gray-700 font-medium">By selecting the correct size, you prevent unnecessary return shipments.</p>
                <div className="bg-white/80 rounded p-3 flex justify-between items-center shadow-sm">
                  <span className="text-sm font-bold text-gray-700">Estimated CO₂ Saved:</span>
                  <span className="text-lg font-black text-[#007185]">
                    <Counter from={0} to={recommendation.co2Saved} duration={2} format={v => `${v}kg`} />
                  </span>
                </div>
              </div>

              {/* Fit Profile Update */}
              <div className="pt-6 border-t border-gray-100 flex justify-center">
                <button 
                  onClick={() => {
                    onClose();
                    navigate('/profile/fit-profile');
                  }}
                  className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <Ruler className="w-4 h-4 mr-2" /> Update Fit Profile
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function AIPurchaseAssistant({ productId, brand, category }) {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRec = async () => {
      try {
        const data = await getAIRecommendation(productId, brand, category);
        setRecommendation(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    if (category === 'Shoes' || category === 'Clothing' || category === 'Fashion') {
      fetchRec();
    } else {
      setLoading(false);
    }
  }, [productId, brand, category]);

  if (category !== 'Shoes' && category !== 'Clothing' && category !== 'Fashion') {
    return null; 
  }

  if (loading) {
    return (
      <div className="w-full h-24 my-4 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#14b8a6] animate-spin" />
      </div>
    );
  }

  if (!recommendation) return null;

  const getRiskColor = (risk) => {
    if (risk === 'Low') return 'bg-green-100 text-green-700 border-green-200';
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        className="w-full my-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-all"
      >
        <div className="flex items-center mb-3">
          <Sparkles className="w-4 h-4 text-[#14b8a6] mr-2" />
          <h2 className="text-sm font-bold text-gray-900">AI Purchase Assistant</h2>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full border border-gray-200">
            {recommendation.recommendedSize}
          </span>
          <span className="px-2.5 py-1 bg-[#14b8a6]/10 text-[#0d9488] text-xs font-bold rounded-full border border-[#14b8a6]/20">
            {recommendation.confidence}% Match
          </span>
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getRiskColor(recommendation.returnRisk)}`}>
            {recommendation.returnRisk} Risk
          </span>
        </div>

        <ul className="space-y-1.5 mb-4 text-xs text-gray-600 font-medium">
          <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-gray-400" /> Based on your purchase history</li>
          <li className="flex items-center"><CheckCircle2 className="w-3.5 h-3.5 mr-2 text-gray-400" /> Similar customer profiles</li>
        </ul>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-bold text-[#007185] hover:text-[#C7511F] hover:underline flex items-center transition-colors"
        >
          View Detailed Analysis <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </motion.div>

      <DetailedAnalysisModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        recommendation={recommendation} 
      />
    </>
  );
}
