"use client";
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 h-11 mx-4 mb-4">
      <Search size={20} className="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search by name or phone..."
        className="flex-1 text-base text-gray-900 outline-none"
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
      />
    </div>
  );
}