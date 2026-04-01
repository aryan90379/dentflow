"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Sparkles, Megaphone } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

type TutorialVideo = {
  id: string;
  title: string;
  duration: string;
  description: string;
  url: string;
};

type TutorialModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// API Actions
import { getAdsAuthUrlAction, fetchAdsMetricsAction, launchAdsCampaignAction } from '@/actions/ads.actions';
import { fetchUserSettings } from '@/actions/settings.actions';

// Components
import MetricsGrid from '@/components/ads/MetricsGrid';
import FunnelVisualizer from '@/components/ads/FunnelVisualizer';
import InsightsEngine from '@/components/ads/InsightsEngine';
import TrendChart from '@/components/ads/TrendChart';
import AdvancedBuilder from '@/components/ads/AdvancedBuilder';
import CampaignTable from '@/components/ads/CampaignTable';

export const TUTORIAL_PLAYLIST: TutorialVideo[] = [
  // Presumed existing playlist items here
];

export const TutorialModal = ({ isOpen, onClose }: TutorialModalProps) => {
  const [activeVideo, setActiveVideo] = useState<TutorialVideo>(TUTORIAL_PLAYLIST[0]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Presumed modal JSX here
};

export default function AdsDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'builder'>('overview');
  
  // Real Dynamic State
  const [isConnected, setIsConnected] = useState(false);
  const [availableTreatments, setAvailableTreatments] = useState<string[]>([]);
  const [metricsData, setMetricsData] = useState({
    totals: { impressions: 0, clicks: 0, spend: 0, conversions: 0 },
    averages: { ctr: 0, cpc: 0, cpa: 0 },
    insights: [],
    campaigns: [] // 👈 ADD THIS
  });

  useEffect(() => {
    async function loadRealData() {
      // 1. Fetch User Profile to check connection and get treatments
      const user = await fetchUserSettings();
      if (user) {
        setIsConnected(user.integrations?.googleAds || false);
        setAvailableTreatments(user.treatments || []);
      }
      
      // 2. If connected, fetch the real Google Ads metrics & AI insights
      if (user?.integrations?.googleAds) {
         const data = await fetchAdsMetricsAction();
         if (data) {
           if (data) {
           setMetricsData({
             totals: data.totals,
             averages: data.averages,
             insights: data.insights,
             campaigns: data.campaigns || [] // 👈 ADD THIS
           });
         }
         }
      }
      setLoading(false);
    }
    loadRealData();
  }, []);

  const handleLaunch = async (payload: any) => {
    const res = await launchAdsCampaignAction(payload);
    if (res.success) {
      alert("🚀 Campaign Launched Successfully! Check your Google Ads dashboard.");
      setActiveTab('overview');
    } else {
      alert("Failed to launch campaign: " + res.error);
    }
  };

  if (loading) return (
    <div className="flex-1 min-h-screen bg-[#F5F5F7] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
        <p className="text-sm font-bold text-slate-500">Syncing with Google Ads API...</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1 min-h-screen bg-[#F5F5F7] font-sans text-slate-900 pb-32 relative">
      {/* Premium Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-300/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] bg-emerald-300/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="flex items-center gap-5">
            <button onClick={() => router.back()} className="p-3.5 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl hover:bg-white transition-all text-slate-600 shadow-[0_4px_20px_rgb(0,0,0,0.04)] shrink-0">
              <ArrowLeft size={22} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
                Ads Manager <Sparkles className="text-amber-500" size={28} />
              </h1>
              <p className="text-sm font-semibold text-slate-500 mt-1">AI-Powered Patient Acquisition Engine.</p>
            </div>
          </div>

          <div className="flex bg-white/60 backdrop-blur-xl p-1.5 rounded-full border border-white/80 shadow-sm w-max">
            <button onClick={() => setActiveTab('overview')} className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
              Overview
            </button>
            <button onClick={() => setActiveTab('builder')} className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'builder' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
              Campaign Builder
            </button>
          </div>
        </div>

        {/* CONNECTION CARD */}
        {!isConnected && (
          <div className="mb-8 bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shrink-0">
                <Megaphone size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Connect Google Ads</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Link your ad account to view live metrics and launch automated campaigns.</p>
              </div>
            </div>
            <button 
              onClick={async () => { 
                const url = await getAdsAuthUrlAction(); 
                if(url) window.location.href = url; 
              }} 
              className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold shadow-md hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Connect Account
            </button>
          </div>
        )}

   {/* --- TAB 1: OVERVIEW --- */}
        {isConnected && activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <MetricsGrid totals={metricsData.totals} averages={metricsData.averages} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <TrendChart />
                <InsightsEngine insights={metricsData.insights} />
              </div>
              <div className="lg:col-span-1">
                <FunnelVisualizer totals={metricsData.totals} averages={metricsData.averages} />
              </div>
            </div>

            {/* 🚀 ADD THE CAMPAIGN TABLE HERE */}
            <CampaignTable campaigns={metricsData.campaigns} />

          </motion.div>
        )}

        {/* --- TAB 2: CAMPAIGN BUILDER --- */}
        {isConnected && activeTab === 'builder' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Pass treatments and the launch handler to the builder */}
            <AdvancedBuilder 
              availableTreatments={availableTreatments} 
              onLaunch={handleLaunch} 
            />
          </motion.div>
        )}

      </div>
    </div>
  );
}