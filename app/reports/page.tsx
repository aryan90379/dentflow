"use client";
import React from 'react';
import { ArrowLeft, Download, Share2, TrendingUp, Users, Activity, IndianRupee, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// --- MOCK DATA ---
const METRICS = [
  { label: 'Total Leads', value: '64', sub: '+18% vs Feb', color: 'text-blue-600', bg: 'bg-blue-50/50', icon: Users },
  { label: 'Conversion', value: '44%', sub: '+8% vs Feb', color: 'text-emerald-600', bg: 'bg-emerald-50/50', icon: Activity },
  { label: 'Reactivated', value: '15', sub: '+5 vs Feb', color: 'text-purple-600', bg: 'bg-purple-50/50', icon: TrendingUp },
  { label: 'Revenue Impact', value: '₹52K', sub: 'Recovered', color: 'text-indigo-600', bg: 'bg-indigo-50/50', icon: IndianRupee },
];

const TREND_DATA = [
  { week: 'W1', leads: 12, revenue: 10 },
  { week: 'W2', leads: 28, revenue: 22 },
  { week: 'W3', leads: 45, revenue: 38 },
  { week: 'W4', leads: 64, revenue: 52 },
];

const SOURCES = [
  { name: 'Google Business', value: 28, color: '#3b82f6' }, // blue-500
  { name: 'WhatsApp', value: 18, color: '#10b981' }, // emerald-500
  { name: 'Instagram', value: 12, color: '#a855f7' }, // purple-500
  { name: 'Website', value: 6, color: '#f59e0b' }, // amber-500
];

const TREATMENTS = [
  { label: 'Teeth Whitening', count: 18 },
  { label: 'Root Canal', count: 14 },
  { label: 'Braces Consult', count: 12 },
  { label: 'General Checkup', count: 10 },
  { label: 'Dental Implants', count: 10 },
];

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring" as const, stiffness: 300, damping: 24 } 
  }
};

export default function MonthlyReportPage() {
  const router = useRouter();

  const handleWhatsAppShare = () => {
    const message = "📊 *DentFlow Monthly Report - March 2026*\n\n*Total New Patients:* 28 (Best in 6 months! 🎉)\n*Total Leads:* 64\n*Conversion Rate:* 44%\n*Revenue Impact:* ₹52K\n\nAmazing work this month! 🚀";
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDownloadReport = () => window.print();

  return (
    <div className="flex-1 min-h-screen bg-[#FAFAFA] font-sans text-slate-900 pb-20 selection:bg-indigo-100">
      
      {/* Ultra-Premium Ambient Background (Mesh Gradient Feel) */}

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4"
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-3 bg-white/50 backdrop-blur-xl border border-slate-200/60 rounded-2xl hover:bg-white transition-all text-slate-500 hover:text-slate-900 shadow-[0_2px_10px_rgb(0,0,0,0.02)] shrink-0"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Performance</h1>
              <p className="text-sm font-semibold text-slate-400 mt-1">March 2026 Overview</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleDownloadReport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/50 backdrop-blur-xl border border-slate-200/60 hover:bg-white text-slate-700 px-6 py-3 rounded-2xl font-bold shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all"
            >
              <Download size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
            <button 
              onClick={handleWhatsAppShare}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold shadow-[0_8px_20px_rgb(0,0,0,0.12)] transition-all transform hover:-translate-y-0.5"
            >
              <Share2 size={18} strokeWidth={2.5} />
              Share Report
            </button>
          </div>
        </motion.div>

        {/* Bento Box Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6"
        >
          {/* Hero Card - Large Span */}
          <motion.div variants={itemVariants} className="lg:col-span-8 bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            {/* Soft gradient orb inside the card */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start mb-8">
              <div>
                <p className="text-sm font-extrabold tracking-widest text-slate-400 uppercase mb-2">Total New Patients</p>
                <div className="flex items-baseline gap-4">
                  <h2 className="text-7xl font-black tracking-tighter leading-none text-slate-900">28</h2>
                  <span className="text-emerald-500 font-bold bg-emerald-50 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <TrendingUp size={14} strokeWidth={3} /> +12%
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-indigo-50/80 text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm border border-indigo-100">
                <Sparkles size={16} /> Best month this year
              </div>
            </div>

            {/* Area Chart for Trend */}
            <div className="relative z-10 h-40 w-full mt-auto -mb-4 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quick Metrics - Right Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-6">
            {METRICS.slice(0, 2).map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color}`}>
                      <Icon size={20} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 mb-1">{metric.label}</p>
                    <h3 className="text-4xl font-black tracking-tight text-slate-900 mb-1">{metric.value}</h3>
                    <p className={`text-xs font-bold ${metric.color}`}>{metric.sub}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Lead Sources - Donut Chart */}
          <motion.div variants={itemVariants} className="lg:col-span-4 bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
            <h3 className="text-sm font-extrabold text-slate-400 tracking-widest uppercase mb-6">Lead Sources</h3>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SOURCES}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {SOURCES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Centered text in Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900">64</span>
                <span className="text-xs font-bold text-slate-400">Total Leads</span>
              </div>
            </div>
            {/* Custom Legend */}
            <div className="mt-4 space-y-3">
              {SOURCES.map((source, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="font-semibold text-slate-600">{source.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{source.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Treatments - List */}
          <motion.div variants={itemVariants} className="lg:col-span-4 bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-sm font-extrabold text-slate-400 tracking-widest uppercase mb-6">Top Treatments</h3>
            <div className="space-y-1">
              {TREATMENTS.map((treatment, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors group cursor-default">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-slate-300 group-hover:text-indigo-400 w-4 text-right transition-colors">
                      {index + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                      {treatment.label}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900 bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 px-3 py-1.5 rounded-xl transition-all">
                    {treatment.count}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Metrics */}
          <motion.div variants={itemVariants} className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-6">
            {METRICS.slice(2, 4).map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div key={index} className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color}`}>
                      <Icon size={20} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 mb-1">{metric.label}</p>
                    <h3 className="text-4xl font-black tracking-tight text-slate-900 mb-1">{metric.value}</h3>
                    <p className={`text-xs font-bold ${metric.color}`}>{metric.sub}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}