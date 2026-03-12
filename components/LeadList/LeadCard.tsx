import React from 'react';
import Link from 'next/link';

const STATUS_CONFIG = {
  hot: { color: '#FF3B30', bg: '#FF3B3015', label: 'HOT' },
  warm: { color: '#FF9500', bg: '#FF950015', label: 'WARM' },
  cold: { color: '#8E8E93', bg: '#8E8E9315', label: 'COLD' },
  booked: { color: '#34C759', bg: '#34C75915', label: 'BOOKED' },
};

export default function LeadCard({ lead }: any) {
  const config = STATUS_CONFIG[lead.status as keyof typeof STATUS_CONFIG];
  const initial = lead.name.charAt(0).toUpperCase();

  return (
    <Link 
      href={`/leads/${lead.id}`} 
      className="flex items-center bg-white border border-gray-200 rounded-xl p-4 mx-4 mb-3 hover:shadow-sm transition"
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center mr-3.5"
        style={{ backgroundColor: config.color }}
      >
        <span className="text-white text-xl font-semibold">{initial}</span>
      </div>

      <div className="flex-1 mr-2">
        <p className="text-lg font-semibold text-gray-900 tracking-tight mb-1">{lead.name}</p>
        <p className="text-sm text-gray-400 truncate">
          {lead.treatment} · {lead.source} · {lead.timeAgo}
        </p>
      </div>

      <div
        className="px-2.5 py-1 rounded-md text-xs font-bold tracking-wide"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        {config.label}
      </div>
    </Link>
  );
}