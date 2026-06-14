import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { analyzeSEO } from '../../api/sellerApi';

export default function SellerSEO() {
  const [formData, setFormData] = useState({ title: '', description: '', features: '' });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!formData.title && !formData.description) return;
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeSEO(formData);
      console.log("SEO Analyzer Response:", data);
      setResults(data);
    } catch (err) {
      console.error("Frontend SEO Error:", err);
      setError(err.response?.data?.message || err.message || 'SEO Analysis service is temporarily unavailable. Please try again.');
      setResults(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Circular gauge calculation
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  const safeSeoScore = results?.seoScore ? Number(results.seoScore) : 0;
  const strokeDashoffset = results ? circumference - (safeSeoScore / 100) * circumference : circumference;

  const getScoreColor = (score) => {
    const numScore = Number(score) || 0;
    if (numScore >= 80) return '#10b981'; // Green
    if (numScore >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">SEO Optimizer</h1>
        <p className="text-sm text-gray-500 mt-1">Analyze and improve your Amazon listing copy using AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2 text-[#14b8a6]" />
            Listing Details
          </h2>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
              <textarea 
                rows="2"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#14b8a6]/50 focus:border-[#14b8a6] outline-none transition-all"
                placeholder="e.g., Wireless Noise Cancelling Headphones Bluetooth 5.0"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key Features (Bullet Points)</label>
              <textarea 
                rows="4"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#14b8a6]/50 focus:border-[#14b8a6] outline-none transition-all"
                placeholder="Paste your 5 bullet points here..."
                value={formData.features}
                onChange={e => setFormData({...formData, features: e.target.value})}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
              <textarea 
                rows="4"
                className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#14b8a6]/50 focus:border-[#14b8a6] outline-none transition-all"
                placeholder="Paste your full product description..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
            <button 
              type="submit" 
              disabled={isAnalyzing || (!formData.title && !formData.description)}
              className="w-full py-3 bg-[#14b8a6] hover:bg-teal-600 disabled:bg-gray-300 text-white rounded-lg font-bold shadow-sm transition-all flex items-center justify-center group"
            >
              {isAnalyzing ? (
                <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Analyzing Listing...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" /> Analyze Listing</>
              )}
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col relative overflow-hidden">
          {!results && !isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 p-6 text-center">
              <Search className="w-16 h-16 mb-4 opacity-20" />
              <p>Enter your listing details and click Analyze to see your SEO score and AI recommendations.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6] mb-4"></div>
              <p className="text-gray-600 font-medium animate-pulse">Running AI Keyword Analysis...</p>
            </div>
          )}

          <AnimatePresence>
            {results && !isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 space-y-6"
              >
                {/* Score Gauge */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
                    <p className="text-sm text-gray-500">Your listing is well optimized but missing key long-tail phrases.</p>
                  </div>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle cx="64" cy="64" r={radius} stroke="#f3f4f6" strokeWidth="12" fill="none" />
                      <motion.circle 
                        cx="64" cy="64" r={radius} 
                        stroke={getScoreColor(safeSeoScore)} 
                        strokeWidth="12" fill="none" 
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: isNaN(strokeDashoffset) ? circumference : strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black text-gray-900 leading-none">{safeSeoScore}</span>
                      <span className="text-xs font-bold text-gray-400">SEO</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Trust Score</p>
                    <p className="text-2xl font-black text-gray-900">{results.trustScore}<span className="text-sm font-normal text-gray-500">/100</span></p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Return Risk</p>
                    <p className={`text-xl font-black ${results.returnRisk === 'High' ? 'text-red-600' : results.returnRisk === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>{results.returnRisk}</p>
                  </div>
                </div>

                {/* Missing Information */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                    Missing Information
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(results.missingInformation) ? results.missingInformation.map(kw => (
                      <span key={kw} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-100">
                        + {kw}
                      </span>
                    )) : null}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-4">
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
                    <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-2">Optimized Title</h3>
                    <p className="text-sm text-teal-900 font-medium">{results.optimizedTitle}</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Optimized Description</h3>
                    <p className="text-sm text-blue-900 font-medium">{results.optimizedDescription}</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                    <h3 className="text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Suggestions</h3>
                    <ul className="text-sm text-purple-900 font-medium space-y-2">
                      {Array.isArray(results.suggestions) ? results.suggestions.map((bp, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                          <span>{bp}</span>
                        </li>
                      )) : null}
                    </ul>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
