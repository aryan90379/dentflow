"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Lightbulb, ArrowLeft, Megaphone, X, Link as LinkIcon, Type, FileText, Loader2, ListFilter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCampaignsAction, createCampaignAction } from '@/actions/campaignActions';
import CreateCampaignModal from '@/components/Campaigns/CreateCampaignModal';

const STATUS_CONFIG = {
  active: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'ACTIVE' },
  completed: { bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-600', label: 'COMPLETED' },
  draft: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'DRAFT' },
};

interface CampaignType {
  _id: string;
  title: string;
  type: string;
  description: string;
  status: string;
  sent: number;
  repliesCount: number;
  booked: number;
}

// --- PREMIUM CREATE CAMPAIGN MODAL ---


export default function CampaignsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaignsAction();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const activeCount = campaigns.filter(c => c.status === 'active').length;
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.booked || 0), 0);

  return (
    <div className="flex-1 min-h-screen relative font-sans text-slate-900 pb-20 bg-slate-50">

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
              <p className="text-sm text-slate-500 font-medium mt-1">{activeCount} active · {totalLeads} conversions</p>
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
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : campaigns.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-700">
            {campaigns.map((item) => {
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

                  <div className="flex-grow" />

                  {/* Metrics Row mapped to DB fields */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-400 mb-1">Sent</span>
                      <span className="text-2xl font-black text-slate-900">{item.sent}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-400 mb-1">Replies</span>
                      <span className="text-2xl font-black text-slate-900">{item.repliesCount}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-400 mb-1">Booked</span>
                      <span className="text-2xl font-black text-green-600">{item.booked}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-white border border-slate-200 border-dashed rounded-3xl">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
              <Megaphone className="text-slate-300" size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No campaigns yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">Create your first outreach campaign to start engaging with your patients.</p>
          </div>
        )}
      </div>

      <CreateCampaignModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCampaignAdded={fetchCampaigns}
      />
    </div>
  );
}