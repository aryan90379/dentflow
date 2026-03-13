"use client";
import React, { useState } from 'react';
import { 
  ArrowLeft, Mail, LogOut, CheckCircle2, ArrowRight, 
  Building2, Bell, Link as LinkIcon, MapPin, Phone, 
  Clock, ShieldCheck, Stethoscope 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// --- CUSTOM TAILWIND SWITCH COMPONENT ---
const CustomSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
      checked ? 'bg-indigo-600' : 'bg-slate-200'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${
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
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);

  return (
    <div className="flex-1 min-h-screen bg-[#F5F5F7] font-sans text-slate-900 pb-20 selection:bg-indigo-100">
      
      {/* Apple-like Ambient Background Blur */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-300/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] bg-purple-300/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center mb-10 gap-5"
        >
          <button 
            onClick={() => router.back()}
            className="p-3.5 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl hover:bg-white transition-all text-slate-600 hover:text-slate-900 shadow-[0_4px_20px_rgb(0,0,0,0.04)] shrink-0"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Settings</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Manage your clinic profile, integrations, and preferences.</p>
          </div>
        </motion.div>

        {/* Bento Box Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          
          {/* Clinic Identity & Contact (Left Column) */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-5 flex flex-col gap-6"
            // Semantic Schema.org markup for local business
            itemScope 
            itemType="https://schema.org/Dentist"
          >
            {/* Doctor / Clinic Profile Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-10" />
              
              <div className="flex items-center gap-5 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-indigo-500/30">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-white">
                    <Stethoscope size={32} className="text-indigo-600" strokeWidth={2} />
                  </div>
                </div>
                <div>
                  <h2 itemProp="name" className="text-2xl font-black tracking-tight text-slate-900">Dr. Ali</h2>
                  <p itemProp="legalName" className="text-base font-bold text-indigo-600">The Tooth Junction</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <Phone size={20} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contact Phone</p>
                    <p itemProp="telephone" className="text-sm font-bold text-slate-800">+91 86928 96336</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <Clock size={20} className="text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Operating Hours</p>
                    <p className="text-sm font-bold text-emerald-600">Open <span className="text-slate-600 font-semibold">⋅ Closes 10 PM</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <Bell size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-extrabold tracking-widest text-slate-400 uppercase">Alerts</h3>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-base font-bold text-slate-700">New Lead Alerts</span>
                  <CustomSwitch checked={alertsEnabled} onChange={setAlertsEnabled} />
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <span className="text-base font-bold text-slate-700">Daily Summary</span>
                  <CustomSwitch checked={emailEnabled} onChange={setEmailEnabled} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-slate-700">WhatsApp Broadcasts</span>
                  <CustomSwitch checked={whatsappEnabled} onChange={setWhatsappEnabled} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Location & Map + Integrations (Right Column) */}
          <motion.div 
            variants={itemVariants} 
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Map & Address Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col h-full">
              {/* Embedded Google Map */}
              <div className="w-full h-64 sm:h-80 rounded-[1.5rem] overflow-hidden bg-slate-100 relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.735147513813!2d72.91093367591605!3d19.11925525061611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c7cc6c5d1e47%3A0x6b45e751842ff841!2sThe%20Tooth%20Junction!5e0!3m2!1sen!2sin!4v1710335000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>
              
              {/* Address Details */}
              <div className="p-6 sm:p-8 flex items-start gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 mt-1">
                  <MapPin size={24} strokeWidth={2.5} />
                </div>
                <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <h3 className="text-lg font-black text-slate-900 mb-2">Clinic Location</h3>
                  <p className="text-base font-medium text-slate-600 leading-relaxed">
                    <span itemProp="streetAddress">Pundalik Villa, 1/A, Main Gate Rd, opp. IIT Market, Tirandaz, Powai</span>{', '}
                    <span itemProp="addressLocality">Mumbai</span>,{' '}
                    <span itemProp="addressRegion">Maharashtra</span>{' '}
                    <span itemProp="postalCode">400076</span>,{' '}
                    <span itemProp="addressCountry">India</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Integrations Panel */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                  <LinkIcon size={20} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm font-extrabold tracking-widest text-slate-400 uppercase">Connected Services</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <span className="text-sm font-bold text-slate-700">Google Calendar</span>
                  <ShieldCheck size={20} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <span className="text-sm font-bold text-slate-700">WhatsApp API</span>
                  <ShieldCheck size={20} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl sm:col-span-2 group cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                  <span className="text-sm font-bold text-slate-700">Google Business Profile</span>
                  <button className="text-sm font-bold text-indigo-600 flex items-center gap-1">
                    Manage <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

          </motion.div>

        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row justify-end gap-4"
        >
          <button className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 hover:bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all">
            <Mail size={18} strokeWidth={2.5} />
            Contact Support
          </button>
          <button className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-100/50 text-red-600 px-8 py-4 rounded-2xl font-bold shadow-sm transition-all">
            <LogOut size={18} strokeWidth={2.5} />
            Sign Out
          </button>
        </motion.div>

      </div>
    </div>
  );
}