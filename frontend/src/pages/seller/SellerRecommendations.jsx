import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Search, ArrowRight, Zap } from 'lucide-react';
import { getAIRecommendations } from '../../api/sellerApi';

export default function SellerRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      const data = await getAIRecommendations();
      setRecommendations(data);
      setLoading(false);
    };
    fetchRecs();
  }, []);

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'bg-red-100 text-red-700 border-red-200';
    if (priority === 'Medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getIcon = (title) => {
    if (title.toLowerCase().includes('seo') || title.toLowerCase().includes('keyword')) return <Search className="w-5 h-5 text-teal-600" />;
    if (title.toLowerCase().includes('image') || title.toLowerCase().includes('content')) return <Target className="w-5 h-5 text-purple-600" />;
    return <Zap className="w-5 h-5 text-amber-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Recommendations</h1>
        <p className="text-sm text-gray-500 mt-1">Prioritized actionable insights to grow your sales.</p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={rec.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow group flex flex-col sm:flex-row gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded border ${getPriorityColor(rec.priority)}`}>
                  {rec.priority} Priority
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                <span className="mr-2 p-1.5 bg-gray-50 rounded-md border border-gray-100">
                  {getIcon(rec.title)}
                </span>
                {rec.title}
              </h3>
              <p className="text-sm text-gray-600">{rec.description}</p>
            </div>

            <div className="flex flex-col sm:items-end justify-center gap-3 min-w-[200px] border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-6">
              <div className="w-full">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Est. SEO Impact</span>
                  <span className="font-bold text-teal-600">{rec.impactSeo}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: rec.impactSeo.replace('%', '').replace('+', '') + '%' }}></div>
                </div>
              </div>
              
              <div className="w-full">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Est. Conv. Lift</span>
                  <span className="font-bold text-blue-600">{rec.impactConv}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: rec.impactConv.replace('%', '').replace('+', '') + '%' }}></div>
                </div>
              </div>

              <button className="mt-2 w-full sm:w-auto px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center">
                Take Action <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
