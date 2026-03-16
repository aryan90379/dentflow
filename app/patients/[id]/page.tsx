"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Phone, MessageCircle, Mail, FileText, CalendarPlus, User, Loader2 } from 'lucide-react';
import { getPatientByIdAction } from '@/actions/patientActions';

const STATUS_CONFIG = {
  active: { bg: 'bg-green-50', border: 'border-green-200/60', text: 'text-green-700', label: 'ACTIVE' },
  dormant: { bg: 'bg-orange-50', border: 'border-orange-200/60', text: 'text-orange-700', label: 'DORMANT' },
  pending_tx: { bg: 'bg-red-50', border: 'border-red-200/60', text: 'text-red-700', label: 'PENDING TX' },
};

interface PatientData {
  _id: string;
  name: string;
  status: string;
  phone: string;
  age: number;
  totalValue: number;
  lastVisit: string;
}

interface TreatmentData {
  _id: string;
  treatmentType: string;
  date: string;
  doctorName: string;
}

export default function PatientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [patient, setPatient] = useState<PatientData | null>(null);
  const [treatments, setTreatments] = useState<TreatmentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) return;
      const data = await getPatientByIdAction(id);
      setPatient(data.patient);
      setTreatments(data.treatments);
      setIsLoading(false);
    };
    fetchPatientData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 min-h-screen flex flex-col items-center justify-center bg-[#fbfbfd]">
        <Loader2 className="animate-spin text-zinc-400 mb-4" size={32} />
        <p className="text-[15px] font-medium text-zinc-500">Loading patient profile...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex-1 min-h-screen flex flex-col items-center justify-center bg-[#fbfbfd]">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-zinc-100">
          <User className="text-zinc-400" size={24} />
        </div>
        <h3 className="text-[18px] font-semibold text-zinc-900 tracking-tight">Patient not found</h3>
        <p className="text-[15px] text-zinc-500 mt-1 max-w-sm font-medium">The patient you're looking for doesn't exist or was removed.</p>
        <button onClick={() => router.back()} className="mt-6 px-5 py-2.5 bg-white border border-zinc-200/80 rounded-full text-[14px] font-semibold text-zinc-700 hover:text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-all">
          Go Back
        </button>
      </div>
    );
  }

  const config = STATUS_CONFIG[patient.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active;
  const formattedLastVisit = patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';
  const displayId = patient._id.slice(-4).toUpperCase();

  return (
    <div className="flex-1 min-h-screen bg-[#fbfbfd] font-sans text-zinc-900 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Apple-style Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => router.back()}
              className="p-2.5 bg-white border border-zinc-200/80 rounded-full hover:bg-zinc-50 transition-all text-zinc-500 hover:text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 shrink-0"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white border border-zinc-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center justify-center text-zinc-800 shrink-0 text-xl font-bold">
                {patient.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-[28px] font-bold tracking-tight text-zinc-900 flex items-center gap-3 leading-none mb-1.5">
                  {patient.name}
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${config.bg} ${config.text} ${config.border} tracking-wide align-middle`}>
                    {config.label}
                  </span>
                </h1>
                <p className="text-[14px] font-medium text-zinc-500">Patient ID: <span className="text-zinc-700">#DF-{displayId}</span></p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center justify-center w-[46px] h-[46px] bg-white border border-zinc-200/80 rounded-full text-blue-500 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95">
              <Phone size={20} strokeWidth={2} />
            </button>
            <button className="flex items-center justify-center w-[46px] h-[46px] bg-white border border-zinc-200/80 rounded-full text-green-500 hover:bg-green-50 hover:border-green-200 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95">
              <MessageCircle size={20} strokeWidth={2} />
            </button>
            <button className="flex items-center justify-center w-[46px] h-[46px] bg-white border border-zinc-200/80 rounded-full text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95">
              <Mail size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Demographics & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-zinc-200/80 rounded-[28px] p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <h2 className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider mb-6">Patient Info</h2>
              
              <div className="space-y-5">
                <div>
                  <p className="text-[13px] font-medium text-zinc-500 mb-0.5">Phone</p>
                  <p className="text-[16px] font-semibold text-zinc-900 tracking-tight">{patient.phone}</p>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-zinc-500 mb-0.5">Age</p>
                  <p className="text-[16px] font-semibold text-zinc-900 tracking-tight">{patient.age ? `${patient.age} Years` : 'N/A'}</p>
                </div>
                <div className="pt-2 border-t border-zinc-100">
                  <p className="text-[13px] font-medium text-zinc-500 mb-0.5">Total Lifetime Value</p>
                  <p className="text-[20px] font-bold text-green-600 tracking-tight">₹ {patient.totalValue?.toLocaleString() || 0}</p>
                </div>
                <div className="pt-2 border-t border-zinc-100">
                  <p className="text-[13px] font-medium text-zinc-500 mb-0.5">Last Visit</p>
                  <p className="text-[15px] font-semibold text-zinc-900">{formattedLastVisit}</p>
                </div>
              </div>

              <button className="w-full mt-8 bg-zinc-900 hover:bg-black text-white py-3.5 rounded-full font-semibold text-[15px] transition-all shadow-[0_4px_14px_rgba(0,0,0,0.15)] active:scale-[0.98]">
                Book New Appointment
              </button>
            </div>
          </div>

          {/* Right Column: Treatment Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-zinc-200/80 rounded-[28px] p-7 sm:p-9 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
              <h2 className="text-[12px] font-bold text-zinc-400 uppercase tracking-wider mb-8">Treatment History</h2>
              
              {/* Sleek CSS Timeline */}
              <div className="relative pl-4 sm:pl-8 border-l-[2px] border-zinc-100 ml-4 sm:ml-6 space-y-10">
                {treatments.length > 0 ? (
                  treatments.map((tx, index) => (
                    <div key={tx._id} className="relative group">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[25px] sm:-left-[41px] ${index === 0 ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-zinc-200 text-zinc-400'} border-[2px] w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white transition-colors`}>
                        {index === 0 ? <CalendarPlus size={14} strokeWidth={2.5} /> : <FileText size={14} strokeWidth={2.5} />}
                      </div>
                      
                      {/* Timeline Content */}
                      <div className="pl-2">
                        <h3 className={`text-[17px] font-semibold tracking-tight mb-1 ${index === 0 ? 'text-zinc-900' : 'text-zinc-700'}`}>
                          {tx.treatmentType}
                        </h3>
                        <p className="text-[14px] font-medium text-zinc-500">
                          {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {tx.doctorName}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-[14px] font-medium text-zinc-500 bg-zinc-50/80 border border-zinc-100 p-6 rounded-[20px] text-center">
                    No treatment history found for this patient yet.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}