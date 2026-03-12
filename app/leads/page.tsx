"use client";
import React, { useState, useMemo } from 'react';
import { ArrowDownToLine, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/LeadList/SearchBar';
import FilterPills from '@/components/LeadList/FilterPills';
import LeadCard from '@/components/LeadList/LeadCard';
import leadsData from '@/data/leads.json';

type FilterType = 'all' | 'hot' | 'warm' | 'cold' | 'booked';

const ThemedBackground = () => (
  <div className="absolute top-0 left-0 w-full pointer-events-none">
    <svg height="350" width="100%" viewBox={`0 0 ${typeof window !== 'undefined' ? window.innerWidth : 1200} 350`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9500" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#F2F2F7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,0 L${typeof window !== 'undefined' ? window.innerWidth : 1200},0 L${typeof window !== 'undefined' ? window.innerWidth : 1200},250 C${typeof window !== 'undefined' ? window.innerWidth * 0.6 : 720},350 ${typeof window !== 'undefined' ? window.innerWidth * 0.2 : 240},150 0,300 Z`}
        fill="url(#grad1)"
      />
    </svg>
  </div>
);

export default function LeadListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const counts = useMemo(() => ({
    all: leadsData.length,
    hot: leadsData.filter(l => l.status === 'hot').length,
    warm: leadsData.filter(l => l.status === 'warm').length,
    cold: leadsData.filter(l => l.status === 'cold').length,
    booked: leadsData.filter(l => l.status === 'booked').length,
  }), []);

  const filteredLeads = useMemo(() => {
    return leadsData.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            lead.treatment.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'all' || lead.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const handleDownloadCSV = () => {
    if (filteredLeads.length === 0) {
      alert('No leads matching your current filter to export.');
      return;
    }

    const header = 'ID,Name,Treatment,Source,Time Ago,Status\n';
    const rows = filteredLeads.map(lead =>
      `${lead.id},"${lead.name}","${lead.treatment}","${lead.source}","${lead.timeAgo}","${lead.status}"`
    ).join('\n');

    const csvString = header + rows;
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DentFlow_Leads_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-gray-100 min-h-screen relative">
      <ThemedBackground />

      <div className="relative z-10">
        <div className="flex items-center px-4 pt-2.5 pb-6">
          <button onClick={() => router.back()} className="p-2 -ml-2 mr-2">
            <ArrowLeft size={26} strokeWidth={2.5} />
          </button>

          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-1">Leads</h1>
            <p className="text-sm text-gray-400 font-medium">
              {counts.all} this month · {counts.booked} booked
            </p>
          </div>

          <button
            onClick={handleDownloadCSV}
            className="w-11 h-11 bg-white rounded-xl border-2 border-gray-200 flex items-center justify-center"
          >
            <ArrowDownToLine size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="pb-2">
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <FilterPills
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
            counts={counts}
          />
        </div>

        <div className="pb-10">
          {filteredLeads.length > 0 ? (
            filteredLeads.map(lead => <LeadCard key={lead.id} lead={lead} />)
          ) : (
            <div className="pt-16 text-center">
              <p className="text-lg font-semibold text-gray-400">No leads found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}