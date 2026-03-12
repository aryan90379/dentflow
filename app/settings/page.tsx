"use client";
import React, { useState } from 'react';
import { ArrowLeft, Mail, LogOut, CheckCircle2, ArrowRight, Building2, TrendingUp, Bell, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// --- CUSTOM TAILWIND SWITCH COMPONENT ---
const CustomSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
      checked ? 'bg-indigo-600' : 'bg-slate-200'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function SettingsPage() {
  const router = useRouter();

  // Toggle States
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  return (
    <div className="flex-1 min-h-screen bg-[#FAFAFA] font-sans text-slate-900 pb-20 selection:bg-indigo-100">
      
      {/* Ultra-Premium Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-slate-400/10 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[50%] bg-indigo-400/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center mb-10 gap-4"
        >
          <button 
            onClick={() => router.back()}
            className="p-3 bg-white/50 backdrop-blur-xl border border-slate-200/60 rounded-2xl hover:bg-white transition-all text-slate-500 hover:text-slate-900 shadow-[0_2px_10px_rgb(0,0,0,0.02)] shrink-0"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Settings</h1>
            <p className="text-sm font-semibold text-slate-400 mt-1">Clinic configuration & preferences</p>
          </div>
        </motion.div>

        {/* Bento Box Grid for Settings */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          
          {/* Clinic Information */}
          <motion.div variants={itemVariants} className="bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <Building2 size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-sm font-extrabold tracking-widest text-slate-400 uppercase">Clinic Information</h2>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-base font-bold text-slate-700">Clinic Name</span>
                <span className="text-base font-semibold text-slate-500">Dr. Mehta's Clinic</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-base font-bold text-slate-700">Location</span>
                <span className="text-base font-semibold text-slate-500">Bandra West, Mumbai</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-700">Phone</span>
                <span className="text-base font-semibold text-slate-500">+91 98765 43210</span>
              </div>
            </div>
          </motion.div>

          {/* Business Metrics */}
          <motion.div variants={itemVariants} className="bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-sm font-extrabold tracking-widest text-slate-400 uppercase">Business Metrics</h2>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-base font-bold text-slate-700">Avg Treatment Value</span>
                <span className="text-base font-semibold text-slate-500">₹3,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-700">Target Monthly Patients</span>
                <span className="text-base font-semibold text-slate-500">50</span>
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div variants={itemVariants} className="bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                <Bell size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-sm font-extrabold tracking-widest text-slate-400 uppercase">Notifications</h2>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-base font-bold text-slate-700">New Lead Alerts</span>
                <CustomSwitch checked={alertsEnabled} onChange={setAlertsEnabled} />
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-base font-bold text-slate-700">Daily Summary Email</span>
                <CustomSwitch checked={emailEnabled} onChange={setEmailEnabled} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-700">WhatsApp Notifications</span>
                <CustomSwitch checked={whatsappEnabled} onChange={setWhatsappEnabled} />
              </div>
            </div>
          </motion.div>

          {/* Integrations */}
          <motion.div variants={itemVariants} className="bg-white border border-slate-200/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                <LinkIcon size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-sm font-extrabold tracking-widest text-slate-400 uppercase">Integrations</h2>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-base font-bold text-slate-700">Google Calendar</span>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1">
                  <CheckCircle2 size={16} /> Connected
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <span className="text-base font-bold text-slate-700">WhatsApp Business</span>
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg flex items-center gap-1">
                  <CheckCircle2 size={16} /> Connected
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-700">Google Business Profile</span>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group transition-colors">
                  Connect <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row justify-end gap-4"
        >
          <button className="flex items-center justify-center gap-2 bg-white/80 backdrop-blur-xl border border-slate-200/60 hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-2xl font-bold shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all">
            <Mail size={18} strokeWidth={2.5} />
            Contact Support
          </button>
          <button className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 px-8 py-4 rounded-2xl font-bold shadow-sm transition-all">
            <LogOut size={18} strokeWidth={2.5} />
            Logout
          </button>
        </motion.div>

      </div>
    </div>
  );
}