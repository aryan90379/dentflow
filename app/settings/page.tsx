"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Mail, LogOut, ArrowRight, Bell, 
  Link as LinkIcon, MapPin, Phone, Clock, 
  ShieldCheck, Stethoscope, Edit2, Save, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { fetchUserSettings, updateUserSettings,getCalendarAuthUrlAction } from '@/actions/settings.actions';
import Autocomplete from "react-google-autocomplete";
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- UNIFIED STATE MANAGEMENT ---
 // --- UNIFIED STATE MANAGEMENT ---
  const defaultData = {
    name: "", clinicName: "", contactPhone: "",
    operatingHours: { open: "", close: "" },
    address: { fullAddress: "", mapUrl: "" }, // 👈 Simplified!
    preferences: { alertsEnabled: true, emailEnabled: true, whatsappEnabled: true },
    integrations: { googleCalendar: false, whatsappApi: false, googleBusiness: false }
  };

  const [originalData, setOriginalData] = useState(defaultData);
  const [formData, setFormData] = useState(defaultData);

  // --- EDIT MODES ---
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    async function loadSettings() {
      const data = await fetchUserSettings();
      if (data) {
        const mappedData = {
          name: data.name || "Doctor",
          clinicName: data.clinicName || "My Clinic",
          contactPhone: data.contactPhone || "",
          operatingHours: { 
            open: data.operatingHours?.open || "09:00 AM", 
            close: data.operatingHours?.close || "10:00 PM" 
          },
          address: {
            fullAddress: data.address?.fullAddress || "", // 👈 Simplified!
            mapUrl: data.address?.mapUrl || ""
          },
          preferences: {
            alertsEnabled: data.preferences?.alertsEnabled ?? true,
            emailEnabled: data.preferences?.emailEnabled ?? true,
            whatsappEnabled: data.preferences?.whatsappEnabled ?? true
          },
          integrations: data.integrations || defaultData.integrations
        };
        setOriginalData(mappedData);
        setFormData(mappedData);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);
  // --- CHECK IF CHANGES EXIST ---
  const hasChanges = JSON.stringify(originalData) !== JSON.stringify(formData);

  // --- HANDLERS ---
  const handleNestedChange = (category: string, field: string, value: any) => {
    setFormData(prev => ({ ...prev, [category]: { ...prev[category as keyof typeof prev] as any, [field]: value } }));
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    const result = await updateUserSettings(formData);
    
    if (result.success) {
      setOriginalData(formData); // Reset diff
      setIsEditingProfile(false);
      setIsEditingAddress(false);
    } else {
      alert("Failed to save settings. Please try again.");
    }
    setIsSaving(false);
  };

  const handleDiscard = () => {
    setFormData(originalData);
    setIsEditingProfile(false);
    setIsEditingAddress(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/signin' });
  };
  
const handleConnectCalendar = async () => {
    try {
      // 1. Fetch the URL securely via the Server Action
      const authUrl = await getCalendarAuthUrlAction();
      
      // 2. Redirect if successful
      if (authUrl) {
        window.location.href = authUrl; 
      } else {
        alert("Failed to get connection link from server. Check your console.");
      }
    } catch (err) {
      console.error("Failed to connect calendar:", err);
      alert("Could not start Google Calendar connection.");
    }
  };

const handlePlaceSelected = (place: any) => {
    if (!place) return;

    // 🔥 Grab the exact full string they selected
    const fullAddressString = place.name 
      ? `${place.name}, ${place.formatted_address}` 
      : place.formatted_address || "";

    // 🗺️ Official Google Maps Embed API URL
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:${place.place_id}`;

    setFormData(prev => ({
      ...prev,
      address: { fullAddress: fullAddressString, mapUrl }
    }));
  };
  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const inputClass = "w-full bg-white/50 border border-indigo-200 rounded-lg px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all";

  return (
    <div className="flex-1 min-h-screen bg-[#F5F5F7] font-sans text-slate-900 pb-32 selection:bg-indigo-100 relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-300/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] bg-purple-300/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center mb-10 gap-5">
          <button onClick={() => router.back()} className="p-3.5 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl hover:bg-white transition-all text-slate-600 hover:text-slate-900 shadow-[0_4px_20px_rgb(0,0,0,0.04)] shrink-0">
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Settings</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">Manage your clinic profile, integrations, and preferences.</p>
          </div>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUMN 1: Profile & Alerts */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-6">
            
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
          </motion.div>

          {/* COLUMN 2: Map & Integrations */}
          <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col gap-6">
            
            {/* MAP & ADDRESS CARD */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col">
              <div className="w-full h-64 sm:h-80 rounded-[1.5rem] overflow-hidden bg-slate-100 relative">
                <iframe 
                  src={formData.address.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11342.3484898158!2d72.823908!3d19.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA3JzI0LjQiTiA3MsKwNDknMjYuMSJF!5e0!3m2!1sen!2sin!4v1611234567890"} 
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0"
                />
              </div>
              
              <div className="p-6 sm:p-8 flex items-start gap-4 relative">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 mt-1">
                  <MapPin size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-slate-900">Clinic Location</h3>
                    <button onClick={() => setIsEditingAddress(!isEditingAddress)} className={`p-2 rounded-full transition-colors -mt-2 ${isEditingAddress ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                      {isEditingAddress ? <X size={18} /> : <Edit2 size={18} />}
                    </button>
                  </div>
              {!isEditingAddress ? (
                    <p className="text-base font-medium text-slate-600 leading-relaxed mt-1">
                      {formData.address.fullAddress || "Address not provided"}
                    </p>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {/* 🔥 The Magic Search Bar */}
                      <Autocomplete
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                        onPlaceSelected={handlePlaceSelected}
                        options={{ types: ["establishment", "geocode"] }}
                        className={`${inputClass} border-indigo-500 ring-2 ring-indigo-100 font-semibold`}
                        placeholder="Search for your clinic or address..."
                      />
                      
                      {/* Single text area for manual edits if needed */}
                      <textarea 
                        value={formData.address.fullAddress} 
                        onChange={e => handleNestedChange('address', 'fullAddress', e.target.value)} 
                        placeholder="Full Clinic Address" 
                        rows={3}
                        className={`${inputClass} resize-none`} 
                      />
                      <input 
                        value={formData.address.mapUrl} 
                        onChange={e => handleNestedChange('address', 'mapUrl', e.target.value)} 
                        placeholder="Google Maps Embed URL" 
                        className={inputClass} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* INTEGRATIONS PANEL */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
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
                    <button 
                      onClick={handleConnectCalendar}
                      className="text-xs font-bold bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      Connect
                    </button>
                  )}
                </div>                <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <span className="text-sm font-bold text-slate-700">WhatsApp API</span>
                  <ShieldCheck size={20} className={formData.integrations.whatsappApi ? "text-emerald-500" : "text-slate-300"} />
                </div>
              </div>
            </div>

          </motion.div>

        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
          <button className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 hover:bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all">
            <Mail size={18} strokeWidth={2.5} /> Contact Support
          </button>
          <button onClick={handleSignOut} className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-100/50 text-red-600 px-8 py-4 rounded-2xl font-bold shadow-sm transition-all">
            <LogOut size={18} strokeWidth={2.5} /> Sign Out
          </button>
        </motion.div>

      </div>

      {/* 🚀 FLOATING SAVE BAR */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/95 backdrop-blur-md p-2 rounded-full shadow-2xl border border-white/10"
          >
            <button 
              onClick={handleDiscard} 
              className="px-5 py-2.5 text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              Discard
            </button>
            <button 
              onClick={handleGlobalSave} 
              disabled={isSaving} 
              className="px-6 py-2.5 text-sm font-bold bg-indigo-500 hover:bg-indigo-400 text-white rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all flex items-center gap-2"
            >
              {isSaving ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save size={16} />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}