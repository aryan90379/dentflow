"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, LogOut, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { signOut } from 'next-auth/react';
import Script from 'next/script'; 

// Server Actions
import { fetchUserSettings, updateUserSettings, getCalendarAuthUrlAction, linkWhatsAppAction } from '@/actions/settings.actions';

// Sub Components
import { SettingsData } from '@/components/settings/types';
import ProfileAndAlerts from '@/components/settings/ProfileAndAlerts';
import ClinicDetails from '@/components/settings/ClinicDetails';
import Integrations from '@/components/settings/Integrations';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const defaultData: SettingsData = {
  name: "", clinicName: "", contactPhone: "",
  operatingHours: { open: "", close: "" },
  address: { fullAddress: "", mapUrl: "" }, 
  preferences: { alertsEnabled: true, emailEnabled: true, whatsappEnabled: true },
  integrations: { googleCalendar: false, whatsappApi: false, googleBusiness: false },
  treatments: []
};

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [originalData, setOriginalData] = useState<SettingsData>(defaultData);
  const [formData, setFormData] = useState<SettingsData>(defaultData);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const data = await fetchUserSettings();
      if (data) {
        const mappedData = {
          name: data.name || "Doctor",
          clinicName: data.clinicName || "My Clinic",
          contactPhone: data.contactPhone || "",
          operatingHours: { open: data.operatingHours?.open || "09:00 AM", close: data.operatingHours?.close || "10:00 PM" },
          address: { fullAddress: data.address?.fullAddress || "", mapUrl: data.address?.mapUrl || "" },
          preferences: { alertsEnabled: data.preferences?.alertsEnabled ?? true, emailEnabled: data.preferences?.emailEnabled ?? true, whatsappEnabled: data.preferences?.whatsappEnabled ?? true },
          integrations: data.integrations || defaultData.integrations,
          treatments: data.treatments || [] 
        };
        setOriginalData(mappedData);
        setFormData(mappedData);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const hasChanges = JSON.stringify(originalData) !== JSON.stringify(formData);

  const handleNestedChange = (category: string, field: string, value: any) => {
    setFormData(prev => ({ ...prev, [category]: { ...prev[category as keyof typeof prev] as any, [field]: value } }));
  };

  const handleGlobalSave = async () => {
    setIsSaving(true);
    const result = await updateUserSettings(formData);
    if (result.success) {
      setOriginalData(formData); 
      setIsEditingProfile(false);
      setIsEditingAddress(false);
    } else alert("Failed to save settings. Please try again.");
    setIsSaving(false);
  };

  const handleDiscard = () => {
    setFormData(originalData);
    setIsEditingProfile(false);
    setIsEditingAddress(false);
  };

  const handleConnectWhatsApp = () => {
    const FB = (window as any).FB;
    if (!FB) return alert("Meta SDK not loaded yet. Please wait a second or refresh.");

    FB.login((response: any) => {
      if (response.authResponse && response.authResponse.code) {
        setIsSaving(true);
        linkWhatsAppAction(response.authResponse.code).then((res) => {
          if (res.success) {
            setFormData(prev => ({ ...prev, integrations: { ...prev.integrations, whatsappApi: true } }));
            alert("WhatsApp Connected Successfully!");
          } else alert("Failed to connect: " + res.error);
          setIsSaving(false);
        });
      } else console.log("User cancelled login.", response);
    }, { config_id: '1077632898764098', response_type: 'code', override_default_response_type: true });
  };

  const handleConnectCalendar = async () => {
    try {
      const authUrl = await getCalendarAuthUrlAction();
      if (authUrl) window.location.href = authUrl; 
      else alert("Failed to get connection link.");
    } catch (err) {
      alert("Could not start Google Calendar connection.");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Script id="facebook-jssdk" src="https://connect.facebook.net/en_US/sdk.js" strategy="afterInteractive" crossOrigin="anonymous" />
      <Script id="facebook-init" strategy="afterInteractive">
        {`
          window.fbAsyncInit = function() {
            FB.init({
              appId      : '${process.env.NEXT_PUBLIC_META_APP_ID}',
              cookie     : true,
              xfbml      : true,
              version    : 'v19.0'
            });
            console.log("Meta SDK Initialized successfully via fbAsyncInit");
          };
        `}
      </Script>

      <div className="flex-1 min-h-screen bg-[#F5F5F7] font-sans text-slate-900 pb-32 selection:bg-indigo-100 relative">
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-300/10 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] bg-purple-300/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
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
            
            <motion.div variants={itemVariants} className="lg:col-span-5">
              <ProfileAndAlerts 
                formData={formData} setFormData={setFormData}
                isEditingProfile={isEditingProfile} setIsEditingProfile={setIsEditingProfile}
                handleNestedChange={handleNestedChange}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-7">
              <ClinicDetails 
                formData={formData} setFormData={setFormData}
                isEditingAddress={isEditingAddress} setIsEditingAddress={setIsEditingAddress}
                handleNestedChange={handleNestedChange}
              />
              <Integrations 
                formData={formData} isSaving={isSaving}
                handleConnectCalendar={handleConnectCalendar} handleConnectWhatsApp={handleConnectWhatsApp}
              />
            </motion.div>

          </motion.div>

          {/* Action Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
            <button className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-xl border border-white/80 hover:bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all">
              <Mail size={18} strokeWidth={2.5} /> Contact Support
            </button>
            <button onClick={() => signOut({ callbackUrl: '/signin' })} className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-100/50 text-red-600 px-8 py-4 rounded-2xl font-bold shadow-sm transition-all">
              <LogOut size={18} strokeWidth={2.5} /> Sign Out
            </button>
          </motion.div>
        </div>

        {/* FLOATING SAVE BAR */}
        <AnimatePresence>
          {hasChanges && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900/95 backdrop-blur-md p-2 rounded-full shadow-2xl border border-white/10"
            >
              <button onClick={handleDiscard} className="px-5 py-2.5 text-sm font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                Discard
              </button>
              <button onClick={handleGlobalSave} disabled={isSaving} className="px-6 py-2.5 text-sm font-bold bg-indigo-500 hover:bg-indigo-400 text-white rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all flex items-center gap-2">
                {isSaving ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save size={16} />}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}