"use client";
import React, { useState, useEffect } from 'react';
import { Megaphone, X, Link as LinkIcon, Type, FileText, Loader2, ListFilter, UploadCloud, User } from 'lucide-react';
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Apple-style backdrop blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Premium Modal Container */}
      <div className="relative bg-white/95 backdrop-blur-3xl border border-white/60 shadow-[0_10px_50px_-12px_rgba(0,0,0,0.15)] w-full max-w-5xl rounded-[32px] overflow-hidden animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-300 flex flex-col h-[90vh] ring-1 ring-black/5">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-white/50">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-zinc-100 text-zinc-600 rounded-full flex items-center justify-center">
              <Megaphone size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-[20px] font-semibold text-zinc-900 tracking-tight leading-none mb-1">New Campaign</h2>
              <p className="text-[14px] font-medium text-zinc-500">Draft your message and preview the patient experience.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-full transition-all active:bg-zinc-200">
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {/* Body: Two Columns */}
        <div className="flex flex-col lg:flex-row flex-grow overflow-hidden bg-white">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-[55%] p-8 space-y-6 overflow-y-auto border-r border-zinc-100 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Campaign Title *</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Type size={18} className="text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input type="text" placeholder="e.g. Summer Whitening" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] pl-10 pr-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Campaign Type</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <ListFilter size={18} className="text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] pl-10 pr-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all appearance-none cursor-pointer">
                    <option value="WhatsApp Broadcast">WhatsApp Broadcast</option>
                    <option value="Email Newsletter">Email Newsletter</option>
                    <option value="SMS Blast">SMS Blast</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Header Image (Optional)</label>
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
                  className="flex items-center gap-3 w-full bg-zinc-100/70 border border-transparent border-dashed hover:border-blue-300 rounded-[14px] px-4 py-3 cursor-pointer hover:bg-blue-50/50 transition-all active:scale-[0.99]"
                >
                  <UploadCloud size={20} className="text-blue-500 shrink-0" />
                  <span className="text-[14px] font-medium text-zinc-600 truncate">
                    {imageFile ? imageFile.name : "Click to upload an image..."}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Message Body *</label>
              <div className="relative group">
                <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none">
                  <FileText size={18} className="text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <textarea placeholder="Hey [Name], we haven't seen you in a while..." rows={6} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] pl-10 pr-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400 resize-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Action Button Link (Optional)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <LinkIcon size={18} className="text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input type="url" placeholder="https://yourclinic.com/book" value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] pl-10 pr-4 py-3 text-[15px] text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400" />
              </div>
            </div>
          </div>

          {/* Right Column: Ultra Realistic iOS WhatsApp Preview */}
          <div className="w-full lg:w-[45%] bg-[#F2F2F7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")', backgroundSize: 'cover' }} />
            
            {/* Phone Container Mockup */}
            <div className="w-full max-w-[320px] h-[580px] bg-zinc-900 rounded-[44px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative z-10 flex flex-col">
              {/* Fake iPhone Dynamic Island / Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[30px] bg-black rounded-b-[20px] z-30"></div>
              {/* Inner Screen wrapper - FIXED clipping issue with isolate and transform-gpu */}
              <div className="flex-1 bg-[#EFEFF4] rounded-[36px] overflow-hidden flex flex-col relative isolate transform-gpu ring-1 ring-inset ring-black/5 m-[8px] pt-6">

                {/* iOS WhatsApp Header */}
                <div className="bg-[#f6f6f6]/95 rounded-t-2xl backdrop-blur-xl border-b border-black/5 px-4 pt-11 pb-3 flex items-center gap-3 shrink-0 relative z-20">
                  <div className="w-9 h-9 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-500 overflow-hidden shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-zinc-900 font-semibold text-[15px] tracking-tight leading-tight">Your Clinic</h3>
                    <p className="text-zinc-500 text-[12px] font-medium">Business Account</p>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="p-4 flex-1 overflow-y-auto space-y-3 relative z-10 flex flex-col justify-start [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                  
                  {/* Date Bubble */}
                  <div className="flex justify-center w-full my-2">
                    <div className="bg-[#E4E4E6] text-[#6b6b70] text-[10px] font-semibold px-3 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                      TODAY
                    </div>
                  </div>

                  {/* Simulated Received Chat Bubble (White/Left) */}
                  <div className="bg-white rounded-[18px] rounded-tl-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.08)] p-1.5 max-w-[90%] self-start relative mt-1">
                    {/* iOS Left Tail */}
                    <div className="absolute top-0 left-[-6px] w-0 h-0 border-[6px] border-transparent border-t-white border-r-white" />
                    
                    {/* Image Preview */}
                    {previewUrl ? (
                      <div className="w-full h-36 bg-zinc-100 rounded-[14px] mb-1.5 overflow-hidden flex items-center justify-center border border-zinc-100">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : null}

                    {/* Text Content */}
                    <div className="px-2 pb-1.5 pt-1">
                      <p className="text-[15px] font-bold text-zinc-900 mb-0.5 leading-tight tracking-tight">
                        {formData.title || <span className="text-zinc-400 font-medium italic">Campaign Title</span>}
                      </p>
                      <p className="text-[15px] text-[#111b21] whitespace-pre-wrap break-words leading-[1.35]">
                        {formData.description || <span className="text-zinc-400 italic">Your message will appear here...</span>}
                      </p>
                    </div>

                    {/* Link Preview (WhatsApp Native Button Style) */}
                    {formData.link ? (
                      <div className="mt-1 border-t border-zinc-100/80 pt-2 pb-1 text-center">
                        <span className="text-[#007aff] text-[15px] font-medium flex items-center justify-center gap-1.5 cursor-default">
                          <LinkIcon size={14} /> View Link
                        </span>
                      </div>
                    ) : null}
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="px-8 py-5 flex items-center justify-end gap-3 bg-zinc-50/50 border-t border-zinc-100 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full font-medium text-[15px] text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 transition-all active:scale-95">
            Cancel
          </button>
          <button onClick={handleLaunch} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-[15px] text-white bg-zinc-900 hover:bg-black shadow-[0_2px_10px_rgba(0,0,0,0.1)] disabled:opacity-70 transition-all active:scale-95">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
            Launch Campaign
          </button>
        </div>

      </div>
    </div>
  );
}