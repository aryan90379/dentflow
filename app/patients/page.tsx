"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, ArrowLeft, ArrowUpRight, Loader2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPatientsAction } from '@/actions/patientActions';
import AddPatientModal from '@/components/Patient/AddPatientModal';

type FilterType = 'all' | 'dormant' | 'pending_tx' | 'active';

interface PatientType {
  _id: string;
  name: string;
  status: string;
  lastVisit: string;
}

const STATUS_CONFIG = {
  active: { bg: 'bg-green-50', border: 'border-green-200/60', text: 'text-green-700', label: 'ACTIVE' },
  dormant: { bg: 'bg-orange-50', border: 'border-orange-200/60', text: 'text-orange-700', label: 'DORMANT' },
  pending_tx: { bg: 'bg-red-50', border: 'border-red-200/60', text: 'text-red-700', label: 'PENDING TX' },
};

export default function PatientsListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPatients = async () => {
    setIsLoading(true);
    const data = await getPatientsAction();
    setPatients(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const counts = useMemo(() => ({
    all: patients.length,
    dormant: patients.filter(p => p.status === 'dormant').length,
    pending_tx: patients.filter(p => p.status === 'pending_tx').length,
    active: patients.filter(p => p.status === 'active').length,
  }), [patients]);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || p.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter, patients]);

  return (
    <div className="flex-1 min-h-screen bg-[#fbfbfd] font-sans text-zinc-900 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Apple-style Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2.5 bg-white border border-zinc-200/80 rounded-full hover:bg-zinc-50 transition-colors text-zinc-500 hover:text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95"
            >
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
            <div>
              <h1 className="text-[32px] font-bold tracking-tight text-zinc-900 leading-tight">Patients</h1>
              <p className="text-[15px] font-medium text-zinc-500 mt-0.5">
                {counts.all} total · {counts.active} active · {counts.pending_tx} pending
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-semibold text-[15px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Patient
          </button>
        </div>

        {/* Search and Filters Control Bar */}
        <div className="bg-white rounded-[24px] border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-3 mb-8 flex flex-col lg:flex-row gap-3 justify-between items-center">
          
          {/* iOS Style Search Bar */}
          <div className="relative w-full lg:w-[400px] group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <Search className="text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={18} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search patients by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100/80 border border-transparent rounded-[16px] pl-10 pr-4 py-2.5 text-[15px] font-medium text-zinc-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400"
            />
          </div>

          {/* iOS Segmented Control for Filters */}
          <div className="flex w-full lg:w-auto bg-zinc-100/80 p-1 rounded-[16px] overflow-x-auto hide-scrollbar">
            {[
              { id: 'all', label: 'All', count: counts.all },
              { id: 'active', label: 'Active', count: counts.active },
              { id: 'pending_tx', label: 'Pending Tx', count: counts.pending_tx },
              { id: 'dormant', label: 'Dormant', count: counts.dormant },
            ].map(f => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id as FilterType)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-[12px] text-[13px] font-semibold transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-white text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)]' 
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  {f.label}
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? 'bg-zinc-100 text-zinc-600' : 'bg-zinc-200/50 text-zinc-400'}`}>
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Patient Grid / List */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-zinc-400 mb-4" size={32} />
            <p className="text-[15px] font-medium text-zinc-500">Loading patients...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-in fade-in duration-500">
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => {
                const config = STATUS_CONFIG[patient.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active;
                const initial = patient.name.charAt(0).toUpperCase();
                const formattedLastVisit = patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

                return (
                  <Link 
                    key={patient._id} 
                    href={`/patients/${patient._id}`}
                    className="group flex items-center bg-white border border-zinc-200/80 rounded-[24px] p-5 hover:border-zinc-300 hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] active:scale-[0.99] transition-all duration-300 cursor-pointer origin-center"
                  >
                    <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center text-[20px] font-semibold shrink-0 ${config.bg} ${config.text} border ${config.border}`}>
                      {initial}
                    </div>
                    
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-[17px] font-semibold text-zinc-900 tracking-tight truncate group-hover:text-blue-500 transition-colors">{patient.name}</h3>
                      <p className="text-[13px] font-medium text-zinc-500 mt-0.5">Last visit: {formattedLastVisit}</p>
                    </div>

                    <div className="flex flex-col items-end ml-3 gap-2.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} tracking-wider`}>
                        {config.label}
                      </span>
                      <ArrowUpRight size={18} className="text-zinc-300 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-zinc-100">
                  <Users className="text-zinc-400" size={24} />
                </div>
                <h3 className="text-[18px] font-semibold text-zinc-900 tracking-tight">No patients found</h3>
                <p className="text-[15px] text-zinc-500 mt-1 max-w-sm font-medium">Try adjusting your search query or filters, or add a new patient.</p>
              </div>
            )}
          </div>
        )}

      </div>

      <AddPatientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPatientAdded={fetchPatients} 
      />
    </div>
  );
}