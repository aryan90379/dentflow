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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const renderMessageContent = (msg: any) => {
    // Render Centered System Messages
    if (msg.text.startsWith('[SYSTEM]')) {
      const cleanText = msg.text.replace('[SYSTEM]', '').trim();
      return (
        <div className="flex justify-center w-full my-3">
          <div className="bg-[#E4E4E6] text-[#6b6b70] text-[11px] font-medium px-4 py-1.5 rounded-full shadow-sm max-w-[85%] text-center">
            {cleanText}
          </div>
        </div>
      );
    }

    // Render WhatsApp Interactive Menu UI
    if (msg.text === 'Sent Main Menu') {
      return (
        <div className="flex flex-col">
          <p className="text-[15px] text-[#111b21] whitespace-pre-wrap break-words leading-snug">
            Hi! 👋 Welcome to our clinic.{"\n\n"}How can we help you today?
          </p>
          <div className="mt-2.5 flex flex-col">
            <div className="border-t border-[#0000001a] py-2.5 text-center text-[#007aff] font-medium text-[16px] cursor-default">
              📅 Book Appointment
            </div>
            <div className="border-t border-[#0000001a] py-2.5 text-center text-[#007aff] font-medium text-[16px] cursor-default">
              🦷 See Treatments
            </div>
            <div className="border-t border-[#0000001a] py-2 text-center text-[#007aff] font-medium text-[16px] cursor-default">
              📍 View on Map
            </div>
          </div>
        </div>
      );
    }

    return <p className="text-[15px] text-[#111b21] whitespace-pre-wrap break-words leading-[1.35]">{msg.text}</p>;
  };

  if (!appointmentId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* iOS-style backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white/95 backdrop-blur-3xl border border-white/60 shadow-[0_10px_50px_-12px_rgba(0,0,0,0.15)] w-full max-w-5xl h-[85vh] rounded-[32px] overflow-hidden animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-300 flex flex-col ring-1 ring-black/5">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h2 className="text-[20px] font-semibold text-zinc-900 tracking-tight">Appointment Details</h2>
            <p className="text-[14px] text-zinc-500 mt-0.5">Review patient info and chat history</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-full transition-all active:bg-zinc-200">
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50/50">
            <Loader2 className="animate-spin text-zinc-400 mb-4" size={32} />
            <p className="text-zinc-500 text-[15px] font-medium">Loading details...</p>
          </div>
        ) : data ? (
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-white">
            
            {/* Left Panel: CRM Info */}
            <div className="w-full lg:w-[35%] border-r border-zinc-100 bg-zinc-50/30 p-8 overflow-y-auto shrink-0">
              <div className="w-20 h-20 bg-white text-zinc-800 rounded-full flex items-center justify-center text-[32px] font-semibold mb-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-zinc-100">
                {data.appointment.patientName?.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-[26px] font-semibold tracking-tight text-zinc-900 mb-2 leading-none">{data.appointment.patientName}</h3>
              <span className={`inline-block px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full border mb-8 ${
                data.appointment.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200/60' : 'bg-orange-50 text-orange-700 border-orange-200/60'
              }`}>
                {data.appointment.status}
              </span>

              <div className="space-y-4">
                <div className="bg-white rounded-[20px] p-5 border border-zinc-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                  <p className="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CalendarIcon size={14}/> Schedule</p>
                  <p className="text-[17px] font-semibold tracking-tight text-zinc-900">{data.appointment.date}</p>
                  <p className="text-[15px] font-medium text-blue-500 mt-0.5">{data.appointment.time}</p>
                </div>
                
                <div className="bg-white rounded-[20px] p-5 border border-zinc-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                  <p className="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Activity size={14}/> Treatment</p>
                  <p className="text-[16px] font-semibold text-zinc-900">{data.appointment.treatmentType || 'Consultation'}</p>
                </div>
                
                <div className="flex items-center gap-4 bg-white rounded-[20px] p-5 border border-zinc-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center border border-zinc-200/50"><Phone size={18} /></div>
                  <div>
                    <p className="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">Contact</p>
                    <p className="text-[16px] font-semibold text-zinc-900">{data.appointment.bookedByPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Native iOS WhatsApp Style */}
            <div className="flex-1 bg-[#EFEFF4] flex flex-col relative overflow-hidden">
              {/* Subtle classic WhatsApp pattern but very faded */}
              <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-cool-dark-green-new-theme-whatsapp.jpg")', backgroundSize: 'cover' }} />
              
              {/* iOS WhatsApp Header (Light mode) */}
              <div className="bg-[#f6f6f6]/90 backdrop-blur-xl border-b border-black/5 px-5 py-3 flex items-center gap-3.5 relative z-10 shrink-0">
                <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-500 overflow-hidden shrink-0">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="text-zinc-900 font-semibold text-[16px] tracking-tight leading-tight">{data.appointment.patientName}</h3>
                  <p className="text-zinc-500 text-[13px] font-medium">+{data.appointment.bookedByPhone}</p>
                </div>
              </div>

              {/* Chat Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 relative z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-black/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                
                {/* Date Bubble */}
                <div className="flex justify-center w-full my-4">
                  <div className="bg-[#E4E4E6] text-[#6b6b70] text-[11px] font-medium px-4 py-1.5 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
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
                        <div className={`relative max-w-[85%] sm:max-w-[70%] px-3.5 pt-2.5 pb-2 shadow-[0_1px_2px_rgba(0,0,0,0.08)] ${
                          isBot ? 'bg-[#DCF7C5] rounded-[18px] rounded-tr-sm' : 'bg-white rounded-[18px] rounded-tl-sm'
                        }`}>
                          
                          {/* CSS Tails (iOS style) */}
                          {isBot ? (
                            <div className="absolute top-0 right-[-6px] w-0 h-0 border-[6px] border-transparent border-t-[#DCF7C5] border-l-[#DCF7C5]" />
                          ) : (
                            <div className="absolute top-0 left-[-6px] w-0 h-0 border-[6px] border-transparent border-t-white border-r-white" />
                          )}

                          {renderMessageContent(msg)}

                          <div className={`flex items-center justify-end gap-1 mt-1 -mr-1 ${msg.text === 'Sent Main Menu' ? 'pr-2 pb-1' : ''}`}>
                            <span className="text-[11px] text-[#8696a0] whitespace-nowrap font-medium">
                              {formatTime(msg.createdAt)}
                            </span>
                            {isBot && <CheckCheck size={15} className="text-[#53bdeb]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full text-[13px] font-medium text-zinc-500 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
                      No messages yet
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} className="h-2" />
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
}