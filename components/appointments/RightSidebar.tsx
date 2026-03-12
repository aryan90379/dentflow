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
  // State for navigating months in the calendar
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(selectedDate));

  // --- Calendar Native Logic ---
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const monthName = currentMonthDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentMonthDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonthDate(new Date(year, month + 1, 1));

  // Generate scrolling dates for the "Strip" view (Next 30 days)
  const stripDates = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(); // Start from today
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
      
      {/* Toggle Controls */}
      <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
        <button 
          onClick={() => setMode('calendar')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
            mode === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <CalendarDays size={16} /> Calendar
        </button>
        <button 
          onClick={() => setMode('strip')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
            mode === 'strip' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <List size={16} /> Scroll View
        </button>
      </div>

      {mode === 'calendar' ? (
        /* --- CALENDAR GRID VIEW --- */
        <div className="animate-in fade-in duration-300">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-900">{monthName} {year}</h2>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextMonth} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-xs font-bold text-slate-400 py-1">{d}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots for first day offset */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {/* Actual Days */}
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
                    aspect-square rounded-full flex flex-col items-center justify-center relative text-sm font-semibold transition-all
                    ${isSelected 
                      ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' 
                      : 'text-slate-700 hover:bg-slate-100'
                    }
                  `}
                >
                  {day}
                  {hasAppts && (
                    <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* --- SCROLLING LIST VIEW --- */
        <div className="animate-in fade-in duration-300">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Upcoming Dates</h2>
          <div className="h-[400px] overflow-y-auto pr-2 space-y-2 scrollbar-hide">
            {stripDates.map((d, i) => {
              const dateStr = d.toISOString().split('T')[0];
              const isSelected = selectedDate.toISOString().split('T')[0] === dateStr;
              const dayAppts = allAppointments.filter(a => a.date === dateStr);

              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(d)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                    isSelected 
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                      : 'bg-white border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {d.toLocaleDateString('en-US', { weekday: 'long' })}
                    </span>
                    <span className={`text-lg font-black ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                      {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {dayAppts.length > 0 && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
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