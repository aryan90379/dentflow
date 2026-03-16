"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Lightbulb, ArrowLeft, ArrowUpRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPatientsAction } from '@/actions/patientActions';
import AddPatientModal from '@/components/Patient/AddPatientModal'; // 👈 Import the modal

type FilterType = 'all' | 'dormant' | 'pending_tx' | 'active';

interface PatientType {
  _id: string;
  name: string;
  status: string;
  lastVisit: string;
}

const STATUS_CONFIG = {
  active: { color: '#16a34a', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'ACTIVE' },
  dormant: { color: '#d97706', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'DORMANT' },
  pending_tx: { color: '#dc2626', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'PENDING TX' },
};

export default function PatientsListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // 👈 Modal state

  // Extracted fetch function so we can reuse it after adding a patient
  const fetchPatients = async () => {
    setIsLoading(true);
    const data = await getPatientsAction();
    setPatients(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const dataToUse = patients;
  const counts = useMemo(() => ({
    all: dataToUse.length,
    dormant: dataToUse.filter(p => p.status === 'dormant').length,
    pending_tx: dataToUse.filter(p => p.status === 'pending_tx').length,
    active: dataToUse.filter(p => p.status === 'active').length,
  }), [dataToUse]);

  const filteredPatients = useMemo(() => {
    return dataToUse.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || p.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter, dataToUse]);

  return (
    <div className="flex-1 min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Abstract Web Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[30%] bg-green-200/20 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[-5%] w-[30%] h-[40%] bg-blue-200/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header & Upload Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 shadow-sm"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Patients</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {counts.all} total · {counts.dormant} dormant · {counts.pending_tx} pending
              </p>
            </div>
          </div>

          {/* 👈 Updated Button to open Modal */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all transform hover:-translate-y-0.5"
          >
            <Plus size={18} strokeWidth={3} />
            Add Patient
          </button>
        </div>

        {/* Controls: Search and Filters */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search patients by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {[
              { id: 'all', label: 'All', count: counts.all, colorClass: 'bg-slate-900 text-white', inactiveClass: 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200' },
              { id: 'active', label: 'Active', count: counts.active, colorClass: 'bg-green-600 text-white border-green-600', inactiveClass: 'bg-white text-slate-600 hover:bg-green-50 hover:text-green-700 border-slate-200' },
              { id: 'pending_tx', label: 'Pending Tx', count: counts.pending_tx, colorClass: 'bg-red-600 text-white border-red-600', inactiveClass: 'bg-white text-slate-600 hover:bg-red-50 hover:text-red-700 border-slate-200' },
              { id: 'dormant', label: 'Dormant 6m+', count: counts.dormant, colorClass: 'bg-amber-500 text-white border-amber-500', inactiveClass: 'bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700 border-slate-200' },
            ].map(f => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as FilterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${isActive ? f.colorClass : f.inactiveClass}`}
                >
                  {f.label} ({f.count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Patient Grid / List */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 animate-in fade-in duration-500">
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => {
                const config = STATUS_CONFIG[patient.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active;
                const initial = patient.name.charAt(0).toUpperCase();
                const formattedLastVisit = patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'N/A';

                return (
                  <Link 
                    key={patient._id} 
                    href={`/patients/${patient._id}`}
                    className="group flex items-center bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shrink-0 ${config.bg} ${config.text} border ${config.border}`}>
                      {initial}
                    </div>
                    
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{patient.name}</h3>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">Last visit: {formattedLastVisit}</p>
                    </div>

                    <div className="flex flex-col items-end ml-2 gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-1 rounded-md border ${config.bg} ${config.text} ${config.border} tracking-wider`}>
                        {config.label}
                      </span>
                      <ArrowUpRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white border border-slate-200 border-dashed rounded-3xl">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <Search className="text-slate-300" size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No patients found</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">Try adjusting your search query or filters, or add a new patient.</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 👈 Mount Modal Component */}
      <AddPatientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPatientAdded={fetchPatients} 
      />
    </div>
  );
}