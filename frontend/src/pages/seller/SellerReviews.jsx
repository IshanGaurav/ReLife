import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { MessageSquare, ThumbsUp, ThumbsDown, Lightbulb, ChevronDown } from 'lucide-react';
import { getReviewIntelligence, getSellerProducts } from '../../api/sellerApi';

const SENTIMENT_COLORS = ['#10b981', '#34d399', '#fcd34d', '#fb923c', '#ef4444'];

export default function SellerReviews() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const prods = await getSellerProducts();
      setProducts(prods);
      setSelectedProduct(prods[0].id);
    };
    init();
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    const fetchReviews = async () => {
      setLoading(true);
      const res = await getReviewIntelligence(selectedProduct);
      setData(res);
      setLoading(false);
    };
    fetchReviews();
  }, [selectedProduct]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Review Intelligence</h1>
          <p className="text-sm text-gray-500 mt-1">AI-driven analysis of customer sentiment and feedback.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <select 
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 px-4 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#14b8a6]/50 focus:border-[#14b8a6]"
          >
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {loading || !data ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14b8a6]"></div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Sentiment Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-center">
            <h2 className="text-lg font-bold text-gray-900 mb-2 w-full">Sentiment Breakdown</h2>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full grid grid-cols-2 gap-2 mt-4">
              {data.sentimentData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs bg-gray-50 px-2 py-1 rounded">
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: SENTIMENT_COLORS[index] }}></span>
                    <span className="text-gray-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summaries */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Positive */}
              <div className="bg-green-50/50 rounded-xl border border-green-100 p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{data.positiveSummary.title}</h2>
                </div>
                <ul className="space-y-3">
                  {data.positiveSummary.points.map((point, i) => (
                    <li key={i} className="text-sm text-green-800 font-medium">{point}</li>
                  ))}
                </ul>
              </div>

              {/* Negative */}
              <div className="bg-red-50/50 rounded-xl border border-red-100 p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <ThumbsDown className="w-5 h-5 text-red-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{data.negativeSummary.title}</h2>
                </div>
                <ul className="space-y-3">
                  {data.negativeSummary.points.map((point, i) => (
                    <li key={i} className="text-sm text-red-800 font-medium">{point}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Actionable Recommendations</h2>
                  <p className="text-xs text-gray-500">Based on negative review trends</p>
                </div>
              </div>
              <div className="space-y-3">
                {data.aiRecommendations.map((rec, i) => (
                  <div key={i} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">{i+1}</span>
                    <p className="text-sm text-gray-800 font-medium mt-0.5">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
