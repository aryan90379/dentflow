"use client";
import React, { useState, useEffect } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import { createPatientAction } from '@/actions/patientActions';

export default function AddPatientModal({ isOpen, onClose, onPatientAdded }: { isOpen: boolean, onClose: () => void, onPatientAdded: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', age: '', status: 'active', notes: '',
    treatmentType: '', treatmentDate: new Date().toISOString().split('T')[0], treatmentCost: '', doctorName: ''
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const res = await createPatientAction(formData);
    
    setIsSubmitting(false);
    if (res.success) {
      onPatientAdded();
      onClose();
    } else {
      alert("Error adding patient: " + res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Apple-style backdrop blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Apple-style frosted glass container */}
      <div className="relative bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_10px_50px_-12px_rgba(0,0,0,0.15)] w-full max-w-2xl rounded-[32px] overflow-hidden animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-300 ease-out ring-1 ring-black/5 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-white/50">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-zinc-100 text-zinc-600 rounded-full flex items-center justify-center">
              <UserPlus size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-[20px] font-semibold text-zinc-900 tracking-tight leading-none mb-1">Add New Patient</h2>
              <p className="text-[14px] font-medium text-zinc-500">Manually add a patient to your CRM.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-full transition-all active:bg-zinc-200">
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-8 overflow-y-auto space-y-8 flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            
            {/* Basic Info Section */}
            <div>
              <h3 className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider mb-4 px-1">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Full Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] px-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400" placeholder="e.g. Rahul Sharma" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Phone Number *</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] px-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Age</label>
                  <input name="age" value={formData.age} onChange={handleChange} type="number" className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] px-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400" placeholder="e.g. 32" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] px-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all appearance-none">
                    <option value="active">Active</option>
                    <option value="pending_tx">Pending Treatment</option>
                    <option value="dormant">Dormant</option>
                  </select>
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">General Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] px-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400 resize-none" rows={2} placeholder="Any general notes or medical history..." />
                </div>
              </div>
            </div>

            {/* Initial Treatment Section */}
            <div className="border-t border-zinc-100 pt-6">
              <h3 className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider mb-4 px-1">Initial Treatment Log (Optional)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Treatment Performed</label>
                  <input name="treatmentType" value={formData.treatmentType} onChange={handleChange} type="text" className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] px-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400" placeholder="e.g. Root Canal, Checkup" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Date</label>
                  <input name="treatmentDate" value={formData.treatmentDate} onChange={handleChange} type="date" className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] px-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Cost (₹)</label>
                  <input name="treatmentCost" value={formData.treatmentCost} onChange={handleChange} type="number" className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] px-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400" placeholder="e.g. 1500" />
                </div>
                <div className="sm:col-span-2 space-y-1.5 pb-2">
                  <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Doctor Name</label>
                  <input name="doctorName" value={formData.doctorName} onChange={handleChange} type="text" className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] px-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400" placeholder="e.g. Dr. Sharma" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 py-5 flex items-center justify-end gap-3 bg-zinc-50/50 border-t border-zinc-100 shrink-0">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full font-medium text-[15px] text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 transition-all active:scale-95">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-[15px] text-white bg-zinc-900 hover:bg-black shadow-[0_2px_10px_rgba(0,0,0,0.1)] disabled:opacity-70 transition-all active:scale-95">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} strokeWidth={2.5} />}
              Save Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}