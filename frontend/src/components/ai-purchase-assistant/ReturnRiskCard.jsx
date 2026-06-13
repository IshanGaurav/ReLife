import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ReturnRiskCard({ recommendation }) {
  if (!recommendation) return null;

  const { returnRisk } = recommendation;
  
  let styles = { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: ShieldCheck, color: '#10b981' };
  
  if (returnRisk === 'Medium') {
    styles = { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: AlertTriangle, color: '#f59e0b' };
  } else if (returnRisk === 'High') {
    styles = { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle, color: '#ef4444' };
  }

  const Icon = styles.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`${styles.bg} border ${styles.border} rounded-xl p-5`}
    >
      <div className="flex items-center mb-3">
        <Icon className={`w-5 h-5 ${styles.text} mr-2`} />
        <h3 className={`text-sm font-bold ${styles.text} uppercase tracking-wider`}>Return Risk: {returnRisk}</h3>
      </div>
      
      {returnRisk !== 'Low' && (
        <p className={`text-sm ${styles.text} font-medium`}>
          Smart Warning: Based on your previous purchase history with this brand and this product's fit trends, returning this size is higher risk. 
          Selecting our recommended size reduces this risk significantly.
        </p>
      )}
      {returnRisk === 'Low' && (
        <p className={`text-sm ${styles.text} font-medium`}>
          You have a high success rate with this fit profile. We expect a great fit!
        </p>
      )}
    </motion.div>
  );
}
