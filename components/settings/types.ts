export interface SettingsData {
  name: string;
  clinicName: string;
  contactPhone: string;
  operatingHours: { open: string; close: string };
  address: { fullAddress: string; mapUrl: string };
  preferences: { alertsEnabled: boolean; emailEnabled: boolean; whatsappEnabled: boolean };
  integrations: { googleCalendar: boolean; whatsappApi: boolean; googleBusiness: boolean };
  treatments: string[];
}

export const inputClass = "w-full bg-white/50 border border-indigo-200 rounded-lg px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all";