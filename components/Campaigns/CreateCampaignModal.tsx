"use client";
import React, { useState, useEffect } from 'react';
import { Megaphone, X, Link as LinkIcon, Type, FileText, Loader2, ListFilter, UploadCloud } from 'lucide-react';
import { createCampaignAction } from '@/actions/campaignActions';

// Helper to convert File to Base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function CreateCampaignModal({ isOpen, onClose, onCampaignAdded }: { isOpen: boolean; onClose: () => void; onCampaignAdded: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    type: 'WhatsApp Broadcast', 
    description: '', 
    link: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else {
      document.body.style.overflow = 'unset';
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, previewUrl]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleLaunch = async () => {
    if (!formData.title || !formData.description) return alert("Please fill in the title and description.");
    
    setIsSubmitting(true);

    let imageBase64 = '';
    if (imageFile) {
      try {
        imageBase64 = await convertToBase64(imageFile);
      } catch (err) {
        alert("Failed to process image.");
        setIsSubmitting(false);
        return;
      }
    }

    // Send pure JSON payload instead of FormData
    const payload = {
      ...formData,
      imageBase64
    };

    const res = await createCampaignAction(payload);
    setIsSubmitting(false);

    if (res.success) {
      onCampaignAdded();
      setFormData({ title: '', type: 'WhatsApp Broadcast', description: '', link: '' });
      setImageFile(null);
      setPreviewUrl('');
      onClose();
    } else {
      alert("Failed to launch campaign: " + res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Megaphone size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Campaign</h2>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Draft your message and see how it looks to patients.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-full transition-all">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body: Two Columns */}
        <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-3/5 p-8 space-y-6 overflow-y-auto border-r border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Campaign Title *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Type size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input type="text" placeholder="e.g. Summer Whitening" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Campaign Type</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ListFilter size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none">
                    <option value="WhatsApp Broadcast">WhatsApp Broadcast</option>
                    <option value="Email Newsletter">Email Newsletter</option>
                    <option value="SMS Blast">SMS Blast</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Header Image (Optional)</label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload" 
                  className="flex items-center gap-3 w-full bg-slate-50 border border-slate-200 border-dashed rounded-2xl px-4 py-3.5 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all"
                >
                  <UploadCloud size={20} className="text-indigo-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-600 truncate">
                    {imageFile ? imageFile.name : "Click to upload an image..."}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Message Body *</label>
              <div className="relative group">
                <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                  <FileText size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <textarea placeholder="Hey [Name], we haven't seen you in a while..." rows={6} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Action Button Link (Optional)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LinkIcon size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input type="url" placeholder="https://yourclinic.com/book" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
              </div>
            </div>
          </div>

          {/* Right Column: Live WhatsApp Preview */}
          <div className="w-full lg:w-2/5 bg-slate-100 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")', backgroundSize: 'cover' }} />
            
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">Live Preview</h3>
            
            {/* Phone Container */}
            <div className="w-full max-w-[320px] bg-[#efeae2] rounded-[2.5rem] shadow-2xl overflow-hidden border-[8px] border-slate-800 relative z-10">
              <div className="bg-[#005c4b] px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                <div className="text-white">
                  <p className="text-sm font-semibold leading-tight">Your Clinic</p>
                  <p className="text-[10px] text-white/70">bot</p>
                </div>
              </div>

              {/* Chat Area */}
              <div className="p-4 min-h-[300px] flex flex-col justify-start">
                <div className="bg-white rounded-lg rounded-tl-none p-1.5 shadow-sm max-w-[95%] self-start relative">
                  
                  {previewUrl ? (
                    <div className="w-full h-32 bg-slate-100 rounded mb-2 overflow-hidden flex items-center justify-center">
                      <img src={previewUrl} alt="Campaign preview" className="w-full h-full object-cover" />
                    </div>
                  ) : null}

                  {/* FIX: Title added as a bold header inside the chat bubble */}
                  <div className="px-1 pb-1">
                    <p className="text-[14px] font-bold text-slate-900 mb-1 leading-tight">
                      {formData.title || <span className="text-slate-400 font-normal italic">Campaign Title</span>}
                    </p>
                    <p className="text-[13px] text-slate-800 whitespace-pre-wrap break-words">
                      {formData.description || <span className="text-slate-400 italic">Your message will appear here...</span>}
                    </p>
                  </div>

                  {formData.link ? (
                    <div className="mt-2 border-t border-slate-100 pt-2 pb-1 text-center">
                      <span className="text-[#027eb5] text-[13px] font-medium flex items-center justify-center gap-1">
                        <LinkIcon size={12} /> View Link
                      </span>
                    </div>
                  ) : null}
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="px-8 py-6 bg-white border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-all">
            Cancel
          </button>
          <button onClick={handleLaunch} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md disabled:opacity-70 transition-all">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
            Launch Campaign
          </button>
        </div>

      </div>
    </div>
  );
}