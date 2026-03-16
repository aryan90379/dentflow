"use client";
import React, { useEffect, useState, useRef } from 'react';
import { X, User, Phone, Activity, Clock, Calendar as CalendarIcon, Loader2, MessageCircle, CheckCheck } from 'lucide-react';
import { getAppointmentDetailsAction } from '@/actions/appointmentActions';

export default function AppointmentDetailModal({ appointmentId, onClose }: { appointmentId: string | null; onClose: () => void }) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appointmentId) {
      document.body.style.overflow = 'hidden';
      fetchDetails();
    } else {
      document.body.style.overflow = 'unset';
      setData(null);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [appointmentId]);

  useEffect(() => {
    if (data?.messages) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data?.messages]);

  const fetchDetails = async () => {
    setIsLoading(true);
    const res = await getAppointmentDetailsAction(appointmentId!);
    if (res) setData(res);
    setIsLoading(false);
  };

  // Helper to format WhatsApp timestamps
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  // Helper to intercept specific text and render as rich WhatsApp interactive UI
  const renderMessageContent = (msg: any) => {
    // Render Centered System Messages (Yellow Pill)
    if (msg.text.startsWith('[SYSTEM]')) {
      const cleanText = msg.text.replace('[SYSTEM]', '').trim();
      return (
        <div className="flex justify-center w-full my-2">
          <div className="bg-[#ffeebd] text-[#54656f] text-[12px] px-4 py-1.5 rounded-xl shadow-sm max-w-[85%] text-center">
            {cleanText}
          </div>
        </div>
      );
    }

    // Render WhatsApp Interactive Buttons for known prompts
    if (msg.text === 'Sent Main Menu') {
      return (
        <div className="flex flex-col">
          <p className="text-[14px] text-[#111b21] whitespace-pre-wrap break-words leading-snug">
            Hi! 👋 Welcome to our clinic.{"\n\n"}How can we help you today?
          </p>
          {/* Mock Interactive Buttons */}
          <div className="mt-2 flex flex-col">
            <div className="border-t border-[#0000001a] py-2.5 text-center text-[#00a884] font-medium text-[15px] cursor-default">
              📅 Book Appointment
            </div>
            <div className="border-t border-[#0000001a] py-2.5 text-center text-[#00a884] font-medium text-[15px] cursor-default">
              🦷 See Treatments
            </div>
            <div className="border-t border-[#0000001a] py-2 text-center text-[#00a884] font-medium text-[15px] cursor-default">
              📍 View on Map
            </div>
          </div>
        </div>
      );
    }

    // Default standard text rendering
    return <p className="text-[14px] text-[#111b21] whitespace-pre-wrap break-words leading-snug">{msg.text}</p>;
  };

  if (!appointmentId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 flex flex-col">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900">Appointment Details</h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Review patient info and chat history</p>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-full transition-all">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
            <p className="text-slate-500 font-medium">Loading details...</p>
          </div>
        ) : data ? (
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            
            {/* Left Panel: Appointment Info */}
            <div className="w-full lg:w-1/3 border-r border-slate-200 bg-white p-8 overflow-y-auto shrink-0">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-black mb-5 shadow-inner">
                {data.appointment.patientName?.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-2">{data.appointment.patientName}</h3>
              <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border mb-8 ${
                data.appointment.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {data.appointment.status}
              </span>

              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><CalendarIcon size={14}/> Schedule</p>
                  <p className="text-lg font-bold text-slate-900">{data.appointment.date}</p>
                  <p className="text-sm font-medium text-indigo-600">{data.appointment.time}</p>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Activity size={14}/> Treatment</p>
                  <p className="text-base font-bold text-slate-900">{data.appointment.treatmentType || 'Consultation'}</p>
                </div>
                
                <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Phone size={18} /></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contact</p>
                    <p className="text-base font-bold text-slate-900">{data.appointment.bookedByPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: WhatsApp Chat History */}
            <div className="flex-1 bg-[#efeae2] flex flex-col relative overflow-hidden">
              {/* WhatsApp Background Doodle */}
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")', backgroundSize: 'cover' }} />
              
              {/* Fake Phone Header */}
              <div className="bg-[#005c4b] px-5 py-3 flex items-center gap-4 relative z-10 shadow-sm shrink-0">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 overflow-hidden shrink-0">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base leading-tight">{data.appointment.patientName}</h3>
                  <p className="text-white/70 text-xs">+{data.appointment.bookedByPhone}</p>
                </div>
              </div>

              {/* Chat Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 relative z-10">
                {/* Date Bubble (Fake Today) */}
                <div className="flex justify-center w-full my-4">
                  <div className="bg-white/80 backdrop-blur shadow-sm text-[#54656f] text-xs font-medium px-4 py-1.5 rounded-lg">
                    TODAY
                  </div>
                </div>

                {data.messages && data.messages.length > 0 ? (
                  data.messages.map((msg: any) => {
                    const isSystem = msg.text.startsWith('[SYSTEM]');
                    const isBot = msg.sender === 'bot' || msg.sender === 'doctor';
                    
                    if (isSystem) {
                      return <div key={msg._id}>{renderMessageContent(msg)}</div>;
                    }

                    return (
                      <div key={msg._id} className={`flex w-full ${isBot ? 'justify-end' : 'justify-start'}`}>
                        <div className={`relative max-w-[85%] sm:max-w-[75%] px-3 pt-2 pb-1.5 shadow-sm text-[14px] ${
                          isBot ? 'bg-[#d9fdd3] rounded-lg rounded-tr-none' : 'bg-white rounded-lg rounded-tl-none'
                        }`}>
                          
                          {/* CSS Triangle Tails */}
                          {isBot ? (
                            <div className="absolute top-0 right-[-8px] w-0 h-0 border-[8px] border-transparent border-t-[#d9fdd3] border-l-[#d9fdd3]" />
                          ) : (
                            <div className="absolute top-0 left-[-8px] w-0 h-0 border-[8px] border-transparent border-t-white border-r-white" />
                          )}

                          {renderMessageContent(msg)}

                          {/* Timestamp and Read Receipt */}
                          <div className={`flex items-center justify-end gap-1 mt-1 -mr-1 ${msg.text === 'Sent Main Menu' ? 'pr-2 pb-1' : ''}`}>
                            <span className="text-[11px] text-[#667781] whitespace-nowrap">
                              {formatTime(msg.createdAt)}
                            </span>
                            {isBot && <CheckCheck size={14} className="text-[#53bdeb]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <div className="bg-white/50 backdrop-blur px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
                      No conversation history available.
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
}