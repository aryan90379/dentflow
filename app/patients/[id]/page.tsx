"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Phone, MessageCircle, Mail, FileText, CalendarPlus, User, Loader2 } from 'lucide-react';
import { getPatientByIdAction } from '@/actions/patientActions';

const STATUS_CONFIG = {
  active: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'ACTIVE' },
  dormant: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'DORMANT' },
  pending_tx: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'PENDING TX' },
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
      <div className="flex-1 min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
        Patient not found.
      </div>
    );
  }

  const config = STATUS_CONFIG[patient.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active;
  
  // Format dates safely
  const formattedLastVisit = patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A';
  const displayId = patient._id.slice(-4).toUpperCase();

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
                {/* FIX: Using _id and slicing the last 4 characters */}
                <p className="text-sm font-semibold text-slate-500 mt-1">Patient ID: #DF-{displayId}</p>
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
                  <p className="text-base font-bold text-slate-900">{patient.age || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Total Lifetime Value</p>
                  <p className="text-base font-black text-green-600">₹ {patient.totalValue || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">Last Visit</p>
                  <p className="text-base font-bold text-slate-900">{formattedLastVisit}</p>
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
              
              {/* HTML/CSS Web Timeline mapped dynamically */}
              <div className="relative pl-4 sm:pl-8 border-l-2 border-dashed border-slate-200 ml-4 sm:ml-6 space-y-10">
                {treatments.length > 0 ? (
                  treatments.map((tx, index) => (
                    <div key={tx._id} className="relative">
                      <div className={`absolute -left-[25px] sm:-left-[41px] ${index === 0 ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-slate-200 text-slate-400'} border-2 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white`}>
                        {index === 0 ? <CalendarPlus size={14} strokeWidth={2.5} /> : <FileText size={14} strokeWidth={2.5} />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{tx.treatmentType}</h3>
                        <p className="text-sm font-medium text-slate-500">
                          {new Date(tx.date).toLocaleDateString()} · {tx.doctorName}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm font-medium text-slate-500 bg-slate-50 p-4 rounded-xl text-center">
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