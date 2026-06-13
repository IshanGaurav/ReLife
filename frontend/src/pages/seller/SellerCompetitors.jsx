import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, GitCompare, Check, X, AlertCircle } from 'lucide-react';
import { analyzeCompetitor } from '../../api/sellerApi';

export default function SellerCompetitors() {
  const [inputUrl, setInputUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!inputUrl) return;
    
    setIsAnalyzing(true);
    try {
      const res = await analyzeCompetitor(inputUrl);
      setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Competitor Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">Benchmark your product against top competitors.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Paste Amazon Product URL or ASIN..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#14b8a6]/50 focus:border-[#14b8a6] outline-none transition-all"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={isAnalyzing || !inputUrl}
            className="px-8 py-3 bg-[#14b8a6] hover:bg-teal-600 disabled:bg-gray-300 text-white rounded-lg font-bold shadow-sm transition-all flex items-center justify-center whitespace-nowrap"
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <GitCompare className="w-5 h-5 mr-2" />
            )}
            Compare Now
          </button>
        </form>
      </div>

      <AnimatePresence>
        {data && !isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Gaps Analysis */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                  Your Feature Gaps
                </h2>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50/50 rounded-lg border border-red-100">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Competitor Highlights:</h3>
                    <ul className="space-y-2">
                      {data.competitorFeatures.map((f, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-700">
                          <Check className="w-4 h-4 mr-2 text-green-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">You Are Missing:</h3>
                    <ul className="space-y-2">
                      {data.yourMissingFeatures.map((f, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-700">
                          <X className="w-4 h-4 mr-2 text-red-500" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-500" />
                  Keyword Gaps
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.keywordGaps.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Side by Side Comparison */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Side-by-Side Comparison</h2>
              </div>
              
              <div className="p-6 flex-1">
                <div className="grid grid-cols-3 gap-4 mb-6 text-sm font-bold text-gray-500 border-b border-gray-100 pb-2">
                  <div>Metric</div>
                  <div className="text-[#14b8a6]">Your Product</div>
                  <div className="text-gray-900">{data.competitorName}</div>
                </div>

                <div className="space-y-6">
                  {/* Price */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-sm font-medium text-gray-700">Price</div>
                    <div className="text-lg font-bold text-gray-900">
                      ${data.priceComparison.yours}
                    </div>
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-900 mr-2">${data.priceComparison.competitor}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-700">
                        {data.priceComparison.gap}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="text-sm font-medium text-gray-700">Rating</div>
                    <div className="text-lg font-bold text-gray-900">{data.ratingComparison.yours}</div>
                    <div className="text-lg font-bold text-gray-900">{data.ratingComparison.competitor}</div>
                  </div>

                  <div className="border-t border-gray-100 pt-6 space-y-6">
                    {data.featureComparison.map((f, i) => (
                      <div key={i} className="grid grid-cols-3 gap-4 items-center">
                        <div className="text-sm font-medium text-gray-700">{f.feature}</div>
                        <div className={`text-sm font-bold ${f.winner === 'yours' ? 'text-[#14b8a6]' : 'text-gray-900'}`}>
                          {f.yours}
                        </div>
                        <div className={`text-sm font-bold ${f.winner === 'competitor' ? 'text-orange-500' : 'text-gray-900'}`}>
                          {f.competitor}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
