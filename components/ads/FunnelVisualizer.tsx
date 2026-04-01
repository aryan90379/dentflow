import React from 'react';
import { Filter } from 'lucide-react';

export default function FunnelVisualizer({ totals = {}, averages = {} }: any) {
  const safeTotals = {
    clicks: totals?.clicks || 0,
    conversions: totals?.conversions || 0,
    impressions: totals?.impressions || 0,
  };

  const safeAverages = {
    ctr: averages?.ctr || 0,
  };

  const cvr = safeTotals.clicks > 0 ? (safeTotals.conversions / safeTotals.clicks) * 100 : 0;

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl"><Filter size={20} /></div>
        <h3 className="text-lg font-black text-slate-900">Patient Funnel</h3>
      </div>

      <div className="flex flex-col gap-2 relative mt-4">
        {/* Connecting Line */}
        <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-slate-100 -z-10 rounded-full" />

        {/* Step 1: Impressions */}
        <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 flex justify-between items-center z-10 shadow-sm">
          <span className="font-bold text-slate-500">Ad Impressions</span>
          <span className="font-black text-xl text-slate-900">{safeTotals.impressions.toLocaleString()}</span>
        </div>

        {/* Dropoff 1 */}
        <div className="text-center py-2 z-10">
          <span className="bg-blue-100 text-blue-700 text-xs font-black px-4 py-1.5 rounded-full border border-blue-200 shadow-sm">
            {safeAverages.ctr.toFixed(1)}% Click Rate
          </span>
        </div>

        {/* Step 2: Clicks */}
        <div className="w-[85%] mx-auto bg-blue-50 border border-blue-200 rounded-2xl p-5 flex justify-between items-center z-10 shadow-sm">
          <span className="font-bold text-blue-700">Website Clicks</span>
          <span className="font-black text-xl text-blue-900">{safeTotals.clicks.toLocaleString()}</span>
        </div>

        {/* Dropoff 2 */}
        <div className="text-center py-2 z-10">
          <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-4 py-1.5 rounded-full border border-emerald-200 shadow-sm">
            {cvr.toFixed(1)}% Conversion Rate
          </span>
        </div>

        {/* Step 3: Leads */}
        <div className="w-[70%] mx-auto bg-emerald-500 border border-emerald-600 rounded-2xl p-5 flex justify-between items-center z-10 shadow-[0_8px_20px_rgba(16,185,129,0.3)]">
          <span className="font-bold text-emerald-50">New Patients</span>
          <span className="font-black text-2xl text-white">{safeTotals.conversions}</span>
        </div>
      </div>
    </div>
  );
}