import React from 'react';
import { MousePointerClick, Target, TrendingUp, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MetricsGrid({ totals = {}, averages = {} }: any) {
  const safeTotals = {
    clicks: totals?.clicks || 0,
    conversions: totals?.conversions || 0,
    impressions: totals?.impressions || 0,
    spend: totals?.spend || 0,
  };

  const safeAverages = {
    cpa: averages?.cpa || 0,
    ctr: averages?.ctr || 0,
    cpc: averages?.cpc || 0,
  };

  const conversionRate = safeTotals.clicks > 0 ? ((safeTotals.conversions / safeTotals.clicks) * 100).toFixed(1) : "0.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard 
        title="Cost Per Lead (CPA)" 
        value={`₹${safeAverages.cpa.toFixed(0)}`} 
        subtitle={`${safeTotals.conversions} total patients`}
        icon={<Target size={24} />} 
        color="indigo" 
      />
      <MetricCard 
        title="Click-Through Rate" 
        value={`${safeAverages.ctr.toFixed(2)}%`} 
        subtitle={`From ${safeTotals.impressions.toLocaleString()} views`}
        icon={<MousePointerClick size={24} />} 
        color="blue" 
      />
      <MetricCard 
        title="Conversion Rate" 
        value={`${conversionRate}%`} 
        subtitle="Clicks to Leads"
        icon={<TrendingUp size={24} />} 
        color="emerald" 
      />
      <MetricCard 
        title="Avg. Cost Per Click" 
        value={`₹${safeAverages.cpc.toFixed(2)}`} 
        subtitle={`Total spend: ₹${safeTotals.spend.toLocaleString()}`}
        icon={<IndianRupee size={24} />} 
        color="amber" 
      />
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon, color }: any) {
  const colorMap: any = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
        <p className="text-sm font-bold text-slate-500 mt-1">{title}</p>
        <p className="text-xs font-semibold text-slate-400 mt-2">{subtitle}</p>
      </div>
    </motion.div>
  );
}