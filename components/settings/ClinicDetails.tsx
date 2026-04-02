import React, { useState } from 'react';
import { Target, Plus, X, MapPin, Edit2 } from 'lucide-react';
import Autocomplete from "react-google-autocomplete";
import { SettingsData, inputClass } from './types';

interface Props {
  formData: SettingsData;
  setFormData: React.Dispatch<React.SetStateAction<SettingsData>>;
  isEditingAddress: boolean;
  setIsEditingAddress: (val: boolean) => void;
  handleNestedChange: (category: string, field: string, value: any) => void;
}

export default function ClinicDetails({ formData, setFormData, isEditingAddress, setIsEditingAddress, handleNestedChange }: Props) {
  const [newTreatment, setNewTreatment] = useState("");

  const handleAddTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTreatment.trim() && !formData.treatments.includes(newTreatment.trim())) {
      setFormData(prev => ({ ...prev, treatments: [...prev.treatments, newTreatment.trim()] }));
      setNewTreatment("");
    }
  };

  const handleRemoveTreatment = (treatmentToRemove: string) => {
    setFormData(prev => ({ ...prev, treatments: prev.treatments.filter(t => t !== treatmentToRemove) }));
  };

  const handlePlaceSelected = (place: any) => {
    if (!place) return;
    const fullAddressString = place.name ? `${place.name}, ${place.formatted_address}` : place.formatted_address || "";
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=place_id:${place.place_id}`;
    setFormData(prev => ({ ...prev, address: { fullAddress: fullAddressString, mapUrl } }));
  };

  return (
    <>
      {/* TREATMENTS CARD */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10" />
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl"><Target size={20} strokeWidth={2.5} /></div>
          <h3 className="text-sm font-extrabold tracking-widest text-slate-400 uppercase">Treatments & Services</h3>
        </div>

        <form onSubmit={handleAddTreatment} className="flex gap-3 mb-6">
          <input 
            type="text" 
            value={newTreatment} 
            onChange={(e) => setNewTreatment(e.target.value)} 
            placeholder="e.g. Root Canal, Teeth Whitening..." 
            className={inputClass}
          />
          <button type="submit" disabled={!newTreatment.trim()} className="bg-indigo-600 text-white px-5 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shrink-0 flex items-center gap-1">
            <Plus size={18} /> Add
          </button>
        </form>
        
        <div className="flex flex-wrap gap-2">
          {formData.treatments.length === 0 ? (
            <p className="text-sm text-slate-500 font-medium italic">No treatments added yet. Add them to use Google Ads.</p>
          ) : (
            formData.treatments.map((t, idx) => (
              <span key={idx} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 text-slate-700 text-sm font-bold rounded-full shadow-sm">
                {t}
                <button type="button" onClick={() => handleRemoveTreatment(t)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* MAP & ADDRESS CARD */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col mt-6">
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
                <Autocomplete
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                  onPlaceSelected={handlePlaceSelected}
                  options={{ types: ["establishment", "geocode"] }}
                  className={`${inputClass} border-indigo-500 ring-2 ring-indigo-100 font-semibold`}
                  placeholder="Search for your clinic or address..."
                />
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
    </>
  );
}