"use client";
import React, { useState, useEffect } from 'react';
import { Plus, X, User, Phone, Activity, Calendar as CalendarIcon, Clock } from 'lucide-react';
import DailySchedule from './DailySchedule';
import RightSidebar from './RightSidebar';

export interface Appointment {
  id: string;
  date: string;
  time: string;
  patient: string;
  treatment: string;
  phone: string;
  status: string;
}

// --- SUPER PREMIUM MODAL COMPONENT ---
const NewAppointmentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Animated Glassmorphic Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 ease-out ring-1 ring-slate-200">
        
        {/* Header */}
        <div className="relative px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Appointment</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Schedule a new patient visit.</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-full transition-all duration-200"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body / Form */}
        <div className="p-8 space-y-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Patient Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Treatment Type */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Treatment Type</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Activity size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="e.g. Root Canal, Teeth Whitening" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Date</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CalendarIcon size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Time</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Clock size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input 
                  type="time" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              // Add your save logic here
              onClose();
            }}
            className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5"
          >
            Confirm Booking
          </button>
        </div>

      </div>
    </div>
  );
};

export default function AppointmentsClient({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date('2026-03-12'));
  const [sidebarMode, setSidebarMode] = useState<'calendar' | 'strip'>('calendar');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Format date to YYYY-MM-DD for filtering
  const selectedDateString = selectedDate.toISOString().split('T')[0];
  
  // Filter appointments for the main view
  const todaysAppointments = initialAppointments.filter(app => app.date === selectedDateString);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage your daily schedule and upcoming bookings.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={20} strokeWidth={2.5} />
          New Appointment
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Pane: Daily Schedule */}
        <div className="xl:col-span-8">
          <DailySchedule 
            date={selectedDate} 
            appointments={todaysAppointments} 
          />
        </div>

        {/* Right Pane: Calendar/Date Controls */}
        <div className="xl:col-span-4 sticky top-6">
          <RightSidebar 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            mode={sidebarMode}
            setMode={setSidebarMode}
            allAppointments={initialAppointments}
          />
        </div>

      </div>

      {/* Render the Modal */}
      <NewAppointmentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}