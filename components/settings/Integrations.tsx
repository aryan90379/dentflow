import React from 'react';
import { LinkIcon, ShieldCheck } from 'lucide-react';
import { SettingsData } from './types';

interface Props {
  formData: SettingsData;
  isSaving: boolean;
  handleConnectCalendar: () => void;
  handleConnectWhatsApp: () => void;
}

export default function Integrations({ formData, isSaving, handleConnectCalendar, handleConnectWhatsApp }: Props) {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><LinkIcon size={20} strokeWidth={2.5} /></div>
        <h3 className="text-sm font-extrabold tracking-widest text-slate-400 uppercase">Connected Services</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
          <span className="text-sm font-bold text-slate-700">Google Calendar</span>
          {formData.integrations.googleCalendar ? (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck size={16} /> Connected
            </div>
          ) : (
            <button onClick={handleConnectCalendar} className="text-xs font-bold bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors">
              Connect
            </button>
          )}
        </div>   
        <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
          <span className="text-sm font-bold text-slate-700">WhatsApp API</span>
          {formData.integrations.whatsappApi ? (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck size={16} /> Connected
            </div>
          ) : (
            <button onClick={handleConnectWhatsApp} disabled={isSaving} className="text-xs font-bold bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors">
              Connect
            </button>
          )}
        </div>
      </div>
    </div>
  );
}