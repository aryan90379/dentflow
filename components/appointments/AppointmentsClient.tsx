"use client";
import React, { useState, useEffect } from 'react';
import { Plus, X, User, Phone, Activity, Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import DailySchedule from './DailySchedule';
import RightSidebar from './RightSidebar';
import { createAppointmentAction } from '@/actions/appointmentActions';
import AppointmentDetailModal from './AppointmentDetailModal'; // 👈 Import the new modal

export interface Appointment {
  _id: string; 
  date: string;
  time: string;
  patientName: string; 
  treatmentType: string; 
  bookedByPhone: string; 
  status: string;
}

// --- NEW APPOINTMENT MODAL ---
const NewAppointmentModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    phone: '',
    treatmentType: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00'
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!formData.patientName || !formData.date || !formData.time) {
      alert("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true);
    // Convert time to 12-hour AM/PM format
    const [hours, minutes] = formData.time.split(':');
    const hoursNum = parseInt(hours, 10);
    const ampm = hoursNum >= 12 ? 'PM' : 'AM';
    const formattedHours = hoursNum % 12 || 12;
    const formattedTime = `${formattedHours}:${minutes} ${ampm}`;

    const payload = {
      ...formData,
      time: formattedTime
    };

    const res = await createAppointmentAction(payload);
    setIsSubmitting(false);

    if (res.success) {
      setFormData({ patientName: '', phone: '', treatmentType: '', date: new Date().toISOString().split('T')[0], time: '10:00' });
      onSuccess();
      onClose();
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 ease-out ring-1 ring-slate-200">
        
        <div className="relative px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">New Appointment</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Schedule a new patient visit.</p>
          </div>
          <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-full transition-all">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-8 space-y-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Patient Name *</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
                </div>
                <input type="text" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} placeholder="e.g. John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
                </div>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Treatment Type</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Activity size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
              </div>
              <input type="text" value={formData.treatmentType} onChange={(e) => setFormData({...formData, treatmentType: e.target.value})} placeholder="e.g. Root Canal, Teeth Whitening" className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Date *</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CalendarIcon size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
                </div>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Time *</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Clock size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
                </div>
                <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-slate-900 font-medium focus:outline-none focus:border-indigo-500 transition-all" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200/50 transition-all">Cancel</button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md disabled:opacity-70 transition-all transform hover:-translate-y-0.5">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
            Confirm Booking
          </button>
        </div>

      </div>
    </div>
  );
};

// --- MAIN PARENT COMPONENT ---
export default function AppointmentsClient({ initialAppointments, onAppointmentAdded }: { initialAppointments: Appointment[], onAppointmentAdded: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sidebarMode, setSidebarMode] = useState<'calendar' | 'strip'>('calendar');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // 👈 State to control which appointment details are currently being viewed
  const [viewingApptId, setViewingApptId] = useState<string | null>(null);

  const selectedDateString = selectedDate.toISOString().split('T')[0];
  const todaysAppointments = initialAppointments.filter(app => app.date === selectedDateString);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Appointments</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Manage your daily schedule and upcoming bookings.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all transform hover:-translate-y-0.5">
          <Plus size={20} strokeWidth={2.5} />
          New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8">
          {/* 👈 Pass down the onSelectAppt callback to DailySchedule */}
          <DailySchedule 
            date={selectedDate} 
            appointments={todaysAppointments} 
            onSelectAppt={(id) => setViewingApptId(id)} 
          />
        </div>
        <div className="xl:col-span-4 sticky top-6">
          <RightSidebar selectedDate={selectedDate} setSelectedDate={setSelectedDate} mode={sidebarMode} setMode={setSidebarMode} allAppointments={initialAppointments} />
        </div>
      </div>

      <NewAppointmentModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={onAppointmentAdded} />
      
      {/* 👈 Render the Details Modal (if viewingApptId is set) */}
      <AppointmentDetailModal appointmentId={viewingApptId} onClose={() => setViewingApptId(null)} />
    </div>
  );
}