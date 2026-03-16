"use client";
import React, { useState } from 'react';
import { CalendarDays, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment } from './AppointmentsClient';

interface RightSidebarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  mode: 'calendar' | 'strip';
  setMode: (mode: 'calendar' | 'strip') => void;
  allAppointments: Appointment[];
}

export default function RightSidebar({ selectedDate, setSelectedDate, mode, setMode, allAppointments }: RightSidebarProps) {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(selectedDate));

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));

  const stripDates = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(); 
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="bg-white rounded-[28px] border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 font-sans">
      
      {/* Apple-style Segmented Control */}
      <div className="flex bg-zinc-100/80 p-1 rounded-[16px] mb-6">
        <button 
          onClick={() => setMode('calendar')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-[13px] font-semibold rounded-[12px] transition-all duration-200 ${
            mode === 'calendar' ? 'bg-white text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)]' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <CalendarDays size={16} /> Calendar
        </button>
        <button 
          onClick={() => setMode('strip')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-[13px] font-semibold rounded-[12px] transition-all duration-200 ${
            mode === 'strip' ? 'bg-white text-zinc-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)]' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <List size={16} /> Scroll View
        </button>
      </div>

      {mode === 'calendar' ? (
        <div className="animate-in fade-in duration-300">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-[17px] font-semibold tracking-tight text-zinc-900">{monthName} {year}</h2>
            <div className="flex gap-0.5">
              <button onClick={prevMonth} className="p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 rounded-full transition-colors active:bg-zinc-200">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 rounded-full transition-colors active:bg-zinc-200">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-[12px] font-semibold text-zinc-400 py-1">{d}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const cellDate = new Date(year, month, day);
              const cellDateString = cellDate.toISOString().split('T')[0];
              const isSelected = selectedDate.toISOString().split('T')[0] === cellDateString;
              const hasAppts = allAppointments.some(a => a.date === cellDateString);

              return (
                <button 
                  key={day}
                  onClick={() => setSelectedDate(cellDate)}
                  className={`
                    aspect-square rounded-full flex flex-col items-center justify-center relative text-[15px] font-medium transition-all active:scale-95
                    ${isSelected 
                      ? 'bg-zinc-900 text-white shadow-md' 
                      : 'text-zinc-700 hover:bg-zinc-100'
                    }
                  `}
                >
                  <span className="relative z-10">{day}</span>
                  {hasAppts && (
                    <div className={`absolute bottom-1.5 w-1 h-1 rounded-full ${isSelected ? 'bg-white/80' : 'bg-blue-500'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <h2 className="text-[12px] font-semibold text-zinc-400 uppercase tracking-wider mb-3 px-1">Upcoming Dates</h2>
          <div className="h-[380px] overflow-y-auto pr-2 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {stripDates.map((d, i) => {
              const dateStr = d.toISOString().split('T')[0];
              const isSelected = selectedDate.toISOString().split('T')[0] === dateStr;
              const dayAppts = allAppointments.filter(a => a.date === dateStr);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(d)}
                  className={`w-full flex items-center justify-between p-4 rounded-[20px] border transition-all text-left active:scale-[0.99] ${
                    isSelected 
                      ? 'bg-zinc-50 border-zinc-300 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]' 
                      : 'bg-white border-zinc-100 hover:border-zinc-300'
                  }`}
                >
                  <div>
                    <span className={`block text-[11px] font-semibold uppercase tracking-wider mb-0.5 ${isSelected ? 'text-blue-600' : 'text-zinc-400'}`}>
                      {d.toLocaleDateString('en-US', { weekday: 'long' })}
                    </span>
                    <span className={`text-[17px] font-semibold tracking-tight ${isSelected ? 'text-zinc-900' : 'text-zinc-700'}`}>
                      {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {dayAppts.length > 0 && (
                    <span className={`text-[12px] font-semibold px-2.5 py-1 rounded-[8px] ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-500 border border-zinc-200/50'}`}>
                      {dayAppts.length} Appt
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}