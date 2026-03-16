"use client";
import React, { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import { createPatientAction } from '@/actions/patientActions';

export default function AddPatientModal({ isOpen, onClose, onPatientAdded }: { isOpen: boolean, onClose: () => void, onPatientAdded: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', age: '', status: 'active', notes: '',
    treatmentType: '', treatmentDate: new Date().toISOString().split('T')[0], treatmentCost: '', doctorName: ''
  });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <UserPlus size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Add New Patient</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto">
          
          <div className="space-y-6">
            {/* Basic Info Section */}
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="e.g. Rahul Sharma" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="+91 9876543210" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Age</label>
                  <input name="age" value={formData.age} onChange={handleChange} type="number" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="e.g. 32" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white">
                    <option value="active">Active</option>
                    <option value="pending_tx">Pending Treatment</option>
                    <option value="dormant">Dormant</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">General Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none" rows={2} placeholder="Any general notes or medical history..." />
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Initial Treatment Section */}
            <div>
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Initial Treatment Log (Optional)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Treatment Performed</label>
                  <input name="treatmentType" value={formData.treatmentType} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="e.g. Root Canal, Checkup" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                  <input name="treatmentDate" value={formData.treatmentDate} onChange={handleChange} type="date" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Cost (₹)</label>
                  <input name="treatmentCost" value={formData.treatmentCost} onChange={handleChange} type="number" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="e.g. 1500" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Doctor Name</label>
                  <input name="doctorName" value={formData.doctorName} onChange={handleChange} type="text" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="e.g. Dr. Sharma" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 transition-colors shadow-md">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              Save Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}