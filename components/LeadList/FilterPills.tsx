"use client";
import React from 'react';
import { CheckSquare } from 'lucide-react';

type FilterType = 'all' | 'hot' | 'warm' | 'cold' | 'booked';

interface FilterPillsProps {
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  counts: Record<FilterType, number>;
}

export default function FilterPills({ activeFilter, onSelectFilter, counts }: FilterPillsProps) {
  const filters = [
    { id: 'all', label: 'All', color: '#007AFF' },
    { id: 'hot', label: 'Hot', color: '#FF3B30', dot: true },
    { id: 'warm', label: 'Warm', color: '#FF9500', dot: true },
    { id: 'cold', label: 'Cold', color: '#000000', dot: true },
    { id: 'booked', label: 'Booked', color: '#34C759', icon: true },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-hide">
      {filters.map((f) => {
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onSelectFilter(f.id as FilterType)}
            className={`flex items-center px-4 py-2 rounded-full border transition-colors ${
              isActive
                ? 'border-transparent text-white'
                : 'border-gray-200 bg-white text-gray-900'
            }`}
            style={{ backgroundColor: isActive ? f.color : undefined }}
          >
            {f.dot && (
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: isActive ? '#fff' : f.color }}
              />
            )}
            {f.icon && <CheckSquare size={16} className="mr-2" color={isActive ? '#fff' : f.color} />}
            <span className="text-sm font-medium">
              {f.label} ({counts[f.id]})
            </span>
          </button>
        );
      })}
    </div>
  );
}