import React from 'react';
import { Stethoscope, Phone, Clock, Edit2, X, Bell } from 'lucide-react';
import { SettingsData, inputClass } from './types';

const CustomSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
  >
    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

interface Props {
  formData: SettingsData;
  setFormData: React.Dispatch<React.SetStateAction<SettingsData>>;
  isEditingProfile: boolean;
  setIsEditingProfile: (val: boolean) => void;
  handleNestedChange: (category: string, field: string, value: any) => void;
}

export default function ProfileAndAlerts({ formData, setFormData, isEditingProfile, setIsEditingProfile, handleNestedChange }: Props) {
  return (
    <div className="lg:col-span-5 flex flex-col gap-6">
      {/* PROFILE CARD */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-10" />
        
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-indigo-500/30 shrink-0">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center border-2 border-white">
                <Stethoscope size={32} className="text-indigo-600" strokeWidth={2} />
              </div>
            </div>
            <div className="flex-1">
              {!isEditingProfile ? (
                <>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">{formData.name}</h2>
                  <p className="text-base font-bold text-indigo-600">{formData.clinicName}</p>
                </>
              ) : (
                <div className="space-y-2">
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Doctor Name" className={inputClass} />
                  <input value={formData.clinicName} onChange={e => setFormData({...formData, clinicName: e.target.value})} placeholder="Clinic Name" className={inputClass} />
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setIsEditingProfile(!isEditingProfile)} className={`p-2 rounded-full transition-colors ${isEditingProfile ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
            {isEditingProfile ? <X size={18} /> : <Edit2 size={18} />}
          </button>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
            <Phone size={20} className="text-slate-400 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contact Phone</p>
              {!isEditingProfile ? (
                <p className="text-sm font-bold text-slate-800">{formData.contactPhone || "Not Set"}</p>
              ) : (
                <input value={formData.contactPhone} onChange={e => setFormData({...formData, contactPhone: e.target.value})} placeholder="+91 99999 99999" className={inputClass} />
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
            <Clock size={20} className="text-slate-400 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Operating Hours</p>
              {!isEditingProfile ? (
                <p className="text-sm font-bold text-emerald-600">Open <span className="text-slate-600 font-semibold">⋅ {formData.operatingHours.open} - {formData.operatingHours.close}</span></p>
              ) : (
                <div className="flex items-center gap-2">
                  <input value={formData.operatingHours.open} onChange={e => handleNestedChange('operatingHours', 'open', e.target.value)} placeholder="09:00 AM" className={inputClass} />
                  <span className="text-slate-400">-</span>
                  <input value={formData.operatingHours.close} onChange={e => handleNestedChange('operatingHours', 'close', e.target.value)} placeholder="10:00 PM" className={inputClass} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ALERTS PANEL */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Bell size={20} strokeWidth={2.5} /></div>
          <h3 className="text-sm font-extrabold tracking-widest text-slate-400 uppercase">Alerts</h3>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <span className="text-base font-bold text-slate-700">New Lead Alerts</span>
            <CustomSwitch checked={formData.preferences.alertsEnabled} onChange={(v) => handleNestedChange('preferences', 'alertsEnabled', v)} />
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <span className="text-base font-bold text-slate-700">Daily Summary</span>
            <CustomSwitch checked={formData.preferences.emailEnabled} onChange={(v) => handleNestedChange('preferences', 'emailEnabled', v)} />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-slate-700">WhatsApp Broadcasts</span>
            <CustomSwitch checked={formData.preferences.whatsappEnabled} onChange={(v) => handleNestedChange('preferences', 'whatsappEnabled', v)} />
          </div>
        </div>
      </div>
    </div>
  );
}