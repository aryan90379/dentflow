import React from 'react';
import { List, PlayCircle, PauseCircle } from 'lucide-react';

export default function CampaignTable({ campaigns = [] }: { campaigns: any[] }) {
  if (campaigns.length === 0) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mt-6">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><List size={20} /></div>
          <h3 className="text-lg font-black text-slate-900">Recent Campaigns</h3>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-widest font-bold">
              <th className="p-5 pl-8 font-extrabold">Campaign Name</th>
              <th className="p-5 font-extrabold">Status</th>
              <th className="p-5 font-extrabold">Daily Budget</th>
              <th className="p-5 font-extrabold">Spend</th>
              <th className="p-5 pr-8 font-extrabold">Clicks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-5 pl-8">
                  <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{camp.name}</span>
                </td>
                <td className="p-5">
                  {camp.status === 'ENABLED' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <PlayCircle size={14} /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      <PauseCircle size={14} /> Paused
                    </span>
                  )}
                </td>
                <td className="p-5 font-bold text-slate-600">₹{camp.budget.toLocaleString()}</td>
                <td className="p-5 font-bold text-slate-600">₹{camp.spend.toLocaleString()}</td>
                <td className="p-5 pr-8 font-bold text-slate-600">{camp.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}