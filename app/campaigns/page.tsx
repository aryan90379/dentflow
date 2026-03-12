"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Lightbulb, ArrowLeft, Megaphone, X, Link as LinkIcon, Type, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import campaignsData from '@/data/campaigns.json'; // Adjust path if needed

const STATUS_CONFIG = {
  active: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'ACTIVE' },
  completed: { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-600', label: 'COMPLETED' },
};

// --- PREMIUM CREATE CAMPAIGN MODAL ---
const CreateCampaignModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({ title: '', text: '', link: '' });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLaunch = () => {
    // Add your submit logic here
    console.log("Launching campaign:", formData);
    onClose();
    setFormData({ title: '', text: '', link: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Animated Glassmorphic Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 ease-out ring-1 ring-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Megaphone size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Campaign</h2>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Draft and launch a new outreach campaign.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-full transition-all duration-200"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Body / Form */}
        <div className="p-8 space-y-6 bg-white overflow-y-auto">
          {/* Campaign Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Campaign Title</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Type size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="e.g. Summer Whitening Offer" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Message Body */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Message Body</label>
            <div className="relative group">
              <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                <FileText size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <textarea 
                placeholder="Hey [Name], we haven't seen you in a while..." 
                rows={4}
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          {/* Booking Link */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Website / Booking Link</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LinkIcon size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input 
                type="url" 
                placeholder="https://yourclinic.com/book" 
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleLaunch}
            className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5"
          >
            Launch Campaign
          </button>
        </div>

      </div>
    </div>
  );
};

export default function CampaignsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Premium Background
  const ThemedBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-blue-200/30 rounded-full blur-[100px]" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[100px]" />
    </div>
  );

  return (
    <div className="flex-1 min-h-screen relative font-sans text-slate-900 pb-20">
      <ThemedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2.5 bg-white hover:bg-slate-100 rounded-xl shadow-sm border border-slate-200 transition-all text-slate-600 hover:text-slate-900 shrink-0"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Campaigns</h1>
              <p className="text-sm text-slate-500 font-medium mt-1">3 active · 45 leads this month</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5"
          >
            <Plus size={20} strokeWidth={2.5} />
            Create Campaign
          </button>
        </div>

        {/* Pro Tip Banner */}
        <div className="mb-8 flex items-start gap-4 bg-amber-50 border border-amber-200 p-5 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <Lightbulb className="text-amber-600" size={20} strokeWidth={2.5} />
          </div>
          <p className="text-slate-700 font-medium mt-2">
            <span className="font-extrabold text-amber-800">Pro Tip: </span>
            Dormant patient campaigns have 3x higher conversion than cold outreach. Target patients who haven't visited in 6+ months.
          </p>
        </div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-700">
          {campaignsData.map((item) => {
            const config = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.completed;
            
            return (
              <div 
                key={item._id} 
                className="group bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col h-full"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4 gap-4">
                  <div>
                    <span className="text-xs font-black text-indigo-600 tracking-widest uppercase block mb-2">
                      {item.type}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border ${config.bg} ${config.text} ${config.border} tracking-wider shrink-0`}>
                    {config.label}
                  </span>
                </div>

                {/* Spacer to push metrics to bottom if titles vary in length */}
                <div className="flex-grow" />

                {/* Metrics Row */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                  {Object.entries(item.metrics).map(([key, value]) => {
                    const isSuccessMetric = key === 'Booked' || key === 'Leads';
                    return (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs font-bold text-slate-400 mb-1">{key}</span>
                        <span className={`text-2xl font-black ${isSuccessMetric ? 'text-green-600' : 'text-slate-900'}`}>
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Render the Modal */}
      <CreateCampaignModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}