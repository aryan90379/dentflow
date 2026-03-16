"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Lightbulb, ArrowLeft, Megaphone, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getCampaignsAction } from '@/actions/campaignActions';
import CreateCampaignModal from '@/components/Campaigns/CreateCampaignModal';

const STATUS_CONFIG = {
  active: { bg: 'bg-green-50', border: 'border-green-200/60', text: 'text-green-700', label: 'ACTIVE' },
  completed: { bg: 'bg-zinc-100', border: 'border-zinc-200/80', text: 'text-zinc-600', label: 'COMPLETED' },
  draft: { bg: 'bg-orange-50', border: 'border-orange-200/60', text: 'text-orange-700', label: 'DRAFT' },
};

interface CampaignType {
  _id: string;
  title: string;
  type: string;
  description: string;
  imageUrl?: string; 
  link?: string;
  status: string;
  sent: number;
  repliesCount: number;
  booked: number;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to resolve the image URL
  const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'; 
    return `${baseUrl}${url}`;
  };

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
    <div className="flex-1 min-h-screen relative font-sans text-zinc-900 pb-20 bg-[#fbfbfd]">

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Apple-style Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2.5 bg-white border border-zinc-200/80 rounded-full hover:bg-zinc-50 transition-colors text-zinc-500 hover:text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 shrink-0"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
            <div>
              <h1 className="text-[32px] font-bold tracking-tight text-zinc-900 leading-tight">Campaigns</h1>
              <p className="text-[15px] font-medium text-zinc-500 mt-0.5">{activeCount} active · {totalLeads} conversions</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-semibold text-[15px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
            Create Campaign
          </button>
        </div>

        {/* Apple-style Pro Tip Banner */}
        <div className="mb-8 flex items-start gap-4 bg-zinc-50 border border-zinc-200/60 p-5 rounded-[24px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-10 h-10 bg-white border border-zinc-200/80 rounded-full flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <Lightbulb className="text-zinc-500" size={20} strokeWidth={2} />
          </div>
          <p className="text-zinc-500 text-[14.5px] font-medium mt-2.5 leading-relaxed">
            <span className="font-semibold text-zinc-900">Pro Tip: </span>
            Dormant patient campaigns have 3x higher conversion than cold outreach. Target patients who haven't visited in 6+ months.
          </p>
        </div>

        {/* Campaigns Grid */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-zinc-400 mb-4" size={32} />
            <p className="text-[15px] font-medium text-zinc-500">Loading campaigns...</p>
          </div>
        ) : campaigns.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-700">
            {campaigns.map((item) => {
              const config = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.completed;
              
              return (
                <div 
                  key={item._id} 
                  className="group bg-white border border-zinc-200/80 rounded-[28px] overflow-hidden hover:border-zinc-300 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full active:scale-[0.99] origin-center cursor-pointer"
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4 flex items-start justify-between gap-4 bg-white z-20 relative shrink-0">
                    <div>
                      <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase block mb-1">
                        {item.type}
                      </span>
                      <span className="text-[14px] font-semibold text-zinc-500">Outreach Campaign</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} tracking-wider shrink-0`}>
                      {config.label}
                    </span>
                  </div>

                  {/* WhatsApp Mini Preview Area (Middle of the card) */}
                  <div className="relative w-full bg-[#EFEFF4] border-y border-zinc-100 flex-1 px-5 py-6 flex flex-col justify-center overflow-hidden isolate transform-gpu">
                    {/* WhatsApp Background Doodle */}
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")', backgroundSize: 'cover' }} />

                    {/* WhatsApp Chat Bubble */}
                    <div className="relative bg-white rounded-[18px] rounded-tl-[6px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-1.5 w-[90%] sm:w-[85%] self-center sm:self-start z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                      
                      {/* iOS Left Tail */}
                      <div className="absolute top-0 left-[-6px] w-0 h-0 border-[6px] border-transparent border-t-white border-r-white hidden sm:block" />

                      {/* Image Preview inside bubble */}
                      {item.imageUrl && (
                        <div className="w-full h-32 bg-zinc-100 rounded-[14px] mb-1.5 overflow-hidden flex items-center justify-center border border-zinc-100/50">
                          <img 
                            src={getFullImageUrl(item.imageUrl)} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}

                      {/* Title and Description Together */}
                      <div className="px-2 pb-1.5 pt-1">
                        <p className="text-[14.5px] font-bold text-zinc-900 mb-0.5 leading-tight tracking-tight">
                          {item.title}
                        </p>
                        <p className="text-[13.5px] text-[#111b21] whitespace-pre-wrap leading-[1.4] line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      {/* Link Button inside bubble */}
                      <div className="mt-1 border-t border-zinc-100/80 pt-2 pb-1 text-center">
                        <span className="text-[#007aff] text-[14px] font-medium flex items-center justify-center gap-1.5">
                          <LinkIcon size={14} /> View Link
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="p-6 bg-white z-20 relative shrink-0">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-semibold text-zinc-400 mb-1">Sent</span>
                        <span className="text-[20px] tracking-tight font-semibold text-zinc-900">{item.sent}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-semibold text-zinc-400 mb-1">Replies</span>
                        <span className="text-[20px] tracking-tight font-semibold text-zinc-900">{item.repliesCount}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-semibold text-zinc-400 mb-1">Booked</span>
                        <span className="text-[20px] tracking-tight font-semibold text-green-600">{item.booked}</span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-zinc-100">
              <Megaphone className="text-zinc-400" size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-[18px] font-semibold text-zinc-900 tracking-tight">No campaigns yet</h3>
            <p className="text-[15px] text-zinc-500 mt-1 max-w-sm font-medium">Create your first outreach campaign to start engaging with your patients.</p>
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