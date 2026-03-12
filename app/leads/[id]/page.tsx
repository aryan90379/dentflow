"use client";
import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Bot, User, CheckCircle2, ArrowUpRight, CalendarClock } from 'lucide-react';
import leadsData from '@/data/leads.json';

const STATUS_CONFIG = {
  hot: { color: '#FF3B30', bg: '#FF3B3015', label: 'HOT' },
  warm: { color: '#FF9500', bg: '#FF950015', label: 'WARM' },
  cold: { color: '#8E8E93', bg: '#8E8E9315', label: 'COLD' },
  booked: { color: '#34C759', bg: '#34C75915', label: 'BOOKED' },
  lost: { color: '#8E8E93', bg: '#E5E5EA', label: 'LOST' },
};

const ThemedBackground = () => (
  <div className="absolute top-0 left-0 w-full pointer-events-none">
    <svg height="400" width="100%" viewBox={`0 0 ${typeof window !== 'undefined' ? window.innerWidth : 1200} 400`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#007AFF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#F2F2F7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34C759" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#F2F2F7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,0 L${typeof window !== 'undefined' ? window.innerWidth : 1200},0 L${typeof window !== 'undefined' ? window.innerWidth : 1200},300 C${typeof window !== 'undefined' ? window.innerWidth * 0.7 : 840},380 ${typeof window !== 'undefined' ? window.innerWidth * 0.3 : 360},200 0,350 Z`}
        fill="url(#grad1)"
      />
      <path
        d={`M${typeof window !== 'undefined' ? window.innerWidth : 1200},0 L0,0 L0,200 C${typeof window !== 'undefined' ? window.innerWidth * 0.4 : 480},280 ${typeof window !== 'undefined' ? window.innerWidth * 0.6 : 720},100 ${typeof window !== 'undefined' ? window.innerWidth : 1200},250 Z`}
        fill="url(#grad2)"
      />
    </svg>
  </div>
);

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const lead = leadsData.find(l => l.id === id) || {
    name: 'Priya Sharma',
    treatment: 'Teeth Whitening',
    source: 'Google Business',
    status: 'hot',
  };

  const [activeStatus, setActiveStatus] = useState(lead.status);
  const config = STATUS_CONFIG[activeStatus as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.hot;

  return (
    <div className="flex-1 bg-gray-100 min-h-screen relative">
      <ThemedBackground />

      <div className="relative z-10">
        <div className="flex items-center px-4 pt-2.5 pb-5">
          <button onClick={() => router.back()} className="p-2 -ml-2 mr-2">
            <ArrowLeft size={26} strokeWidth={2.5} />
          </button>

          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{lead.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">
              Lead since 14 Mar · via {lead.source}
            </p>
          </div>

          <div
            className="px-3 py-1.5 rounded-md border-2"
            style={{ backgroundColor: config.bg, borderColor: config.color }}
          >
            <span className="text-xs font-extrabold tracking-wide" style={{ color: config.color }}>
              {config.label}
            </span>
          </div>
        </div>

        <div className="p-4 pt-0 space-y-4">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-extrabold text-blue-500 tracking-wider mb-4">QUALIFICATION ANSWERS</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-1">Treatment</p>
                <p className="text-base font-bold text-gray-900">{lead.treatment}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-1">Area</p>
                <p className="text-base font-bold text-gray-900">Within 3km</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-1">Urgency</p>
                <p className="text-base font-bold text-gray-900">This Week</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-1">Ready to Book</p>
                <p className="text-base font-bold text-green-500">Yes ✔</p>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-400 mb-3">Lead Status</p>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {['hot', 'warm', 'cold', 'lost'].map((status) => {
                const isActive = activeStatus === status;
                const statusData = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                return (
                  <button
                    key={status}
                    onClick={() => setActiveStatus(status)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors font-extrabold text-sm tracking-wide`}
                    style={{
                      backgroundColor: isActive ? statusData.color : '#FFFFFF',
                      borderColor: isActive ? statusData.color : '#E5E5EA',
                      color: isActive ? '#FFFFFF' : '#8E8E93',
                    }}
                  >
                    {statusData.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-extrabold text-blue-500 tracking-wider mb-4">CONVERSATION LOG</p>
            <div className="relative pl-2">
              <div className="absolute left-5 top-2 bottom-0 w-0.5">
                <svg height="100%" width="2" className="absolute">
                  <line x1="1" y1="0" x2="1" y2="100%" stroke="#E5E5EA" strokeWidth="2" strokeDasharray="6 6" />
                </svg>
              </div>

              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mr-4 -mt-1 z-10">
                    <Bot size={14} color="#8E8E93" />
                  </div>
                  <p className="text-base text-gray-900 flex-1">Bot sent welcome message — <span className="text-gray-400">2:14 PM</span></p>
                </div>
                <div className="flex items-start">
                  <div className="w-7 h-7 rounded-full bg-blue-50 border-2 border-blue-500 flex items-center justify-center mr-4 -mt-1 z-10">
                    <User size={14} color="#007AFF" />
                  </div>
                  <p className="text-base text-gray-900 flex-1">Patient replied "{lead.treatment}" — <span className="text-gray-400">2:16 PM</span></p>
                </div>
                <div className="flex items-start">
                  <div className="w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mr-4 -mt-1 z-10">
                    <Bot size={14} color="#8E8E93" />
                  </div>
                  <p className="text-base text-gray-900 flex-1">Bot sent booking link — <span className="text-gray-400">2:18 PM</span></p>
                </div>
                <div className="flex items-start">
                  <div className="w-7 h-7 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center mr-4 -mt-1 z-10">
                    <CheckCircle2 size={14} color="#34C759" />
                  </div>
                  <p className="text-base text-green-500 font-semibold flex-1">Appointment booked — <span className="text-green-400">2:22 PM</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-[60px] left-0 right-0 h-0.5">
              <svg height="2" width="100%">
                <line x1="0" y1="1" x2="100%" y2="1" stroke="#A9E3B4" strokeWidth="2" strokeDasharray="6 6" />
              </svg>
            </div>
            <div className="absolute top-[52px] -left-2.5 w-4 h-4 rounded-full bg-gray-100 border-2 border-green-300"></div>
            <div className="absolute top-[52px] -right-2.5 w-4 h-4 rounded-full bg-gray-100 border-2 border-green-300"></div>

            <div className="flex items-center mb-7">
              <CalendarClock size={20} color="#34C759" strokeWidth={2.5} />
              <span className="text-xs font-extrabold text-green-500 tracking-wider ml-2">APPOINTMENT CONFIRMED</span>
            </div>
            <p className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight">Sat, 16 Mar · 11:00 AM</p>
            <div className="flex items-center">
              <span className="text-base text-blue-500 font-semibold">{lead.treatment} · Google Calendar</span>
              <ArrowUpRight size={16} color="#007AFF" className="ml-1" strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button className="flex-1 bg-blue-500 py-4 rounded-lg text-white font-extrabold text-lg tracking-wide hover:bg-blue-600 transition">
              Send Booking Link
            </button>
            <button className="flex-1 bg-white border-2 border-gray-200 py-4 rounded-lg text-gray-900 font-extrabold text-lg tracking-wide hover:bg-gray-50 transition">
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}