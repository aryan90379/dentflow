"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Phone, MessageCircle, Mail, FileText, CalendarPlus, User } from 'lucide-react';

const STATUS_CONFIG = {
  active: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'ACTIVE' },
  dormant: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'DORMANT' },
  pending_tx: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'PENDING TX' },
};

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Mock fetching patient based on ID
  const patient = {
    id: id,
    name: 'Divya Rao',
    lastVisit: '8 months ago',
    status: 'dormant',
    phone: '+91 98765 43210',
    age: '32 Years',
    totalValue: '₹ 45,000'
  };

  const config = STATUS_CONFIG[patient.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active;

  return (
    <div className="flex-1 min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 shadow-sm shrink-0"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
                <User size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                  {patient.name}
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${config.bg} ${config.text} ${config.border} tracking-wide align-middle`}>
                    {config.label}
                  </span>
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1">Patient ID: #DF-{patient.id.padStart(4, '0')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded-xl text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm">
              <Phone size={20} strokeWidth={2.5} />
            </button>
            <button className="flex items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded-xl text-green-600 hover:bg-green-50 hover:border-green-200 transition-colors shadow-sm">
              <MessageCircle size={20} strokeWidth={2.5} />
            </button>
            <button className="flex items-center justify-center w-12 h-12 bg-white border border-slate-200 rounded-xl text-amber-500 hover:bg-amber-50 hover:border-amber-200 transition-colors shadow-sm">
              <Mail size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Demographics & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <h2 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-6">Patient Info</h2>
              
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Phone</p>
                  <p className="text-base font-bold text-slate-900">{patient.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Age</p>
                  <p className="text-base font-bold text-slate-900">{patient.age}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Total Lifetime Value</p>
                  <p className="text-base font-black text-green-600">{patient.totalValue}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Last Visit</p>
                  <p className="text-base font-bold text-slate-900">{patient.lastVisit}</p>
                </div>
              </div>

              <button className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold transition-all shadow-md transform hover:-translate-y-0.5">
                Book New Appointment
              </button>
            </div>
          </div>

          {/* Right Column: Treatment Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xs font-black text-slate-400 tracking-widest uppercase mb-8">Treatment History</h2>
              
              {/* HTML/CSS Web Timeline (No SVG needed) */}
              <div className="relative pl-4 sm:pl-8 border-l-2 border-dashed border-slate-200 ml-4 sm:ml-6 space-y-10">
                
                {/* Log 1 */}
                <div className="relative">
                  <div className="absolute -left-[25px] sm:-left-[41px] bg-white border-2 border-slate-200 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 ring-4 ring-white">
                    <FileText size={14} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Root Canal Treatment (RCT)</h3>
                    <p className="text-sm font-medium text-slate-500">12 July 2023 · Dr. Sharma</p>
                  </div>
                </div>

                {/* Log 2 */}
                <div className="relative">
                  <div className="absolute -left-[25px] sm:-left-[41px] bg-white border-2 border-slate-200 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 ring-4 ring-white">
                    <FileText size={14} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Routine Cleaning & Polish</h3>
                    <p className="text-sm font-medium text-slate-500">15 Jan 2023 · Hygienist</p>
                  </div>
                </div>

                {/* Log 3 */}
                <div className="relative">
                  <div className="absolute -left-[25px] sm:-left-[41px] bg-indigo-50 border-2 border-indigo-500 w-8 h-8 rounded-full flex items-center justify-center text-indigo-600 ring-4 ring-white">
                    <CalendarPlus size={14} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Initial Consultation</h3>
                    <p className="text-sm font-medium text-slate-500">05 Jan 2023</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}