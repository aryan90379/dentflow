"use client";
import React, { useState, useEffect } from 'react';
import { Plus, X, User, Phone, Activity, Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import DailySchedule from './DailySchedule';
import RightSidebar from './RightSidebar';
import { createAppointmentAction } from '@/actions/appointmentActions';
import AppointmentDetailModal from './AppointmentDetailModal'; 

export interface Appointment {
  _id: string; 
  date: string;
  time: string;
  patientName: string; 
  treatmentType: string; 
  bookedByPhone: string; 
  status: string;
}

// --- APPLE-STYLE MODAL COMPONENT ---
const NewAppointmentModal = ({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ✅ LOCAL DATE FUNCTION
function getTodayLocalDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const [formData, setFormData] = useState({
  patientName: '',
  phone: '',
  treatmentType: '',
  date: getTodayLocalDate(),
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
setFormData({
  patientName: '',
  phone: '',
  treatmentType: '',
  date: getTodayLocalDate(),
  time: '10:00'
});      onSuccess();
      onClose();
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Apple-style backdrop blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Apple-style frosted glass container */}
      <div className="relative bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] w-full max-w-2xl rounded-[28px] overflow-hidden animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-300 ease-out ring-1 ring-black/5">
        
        <div className="relative px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-[22px] font-semibold text-zinc-900 tracking-tight leading-tight">New Appointment</h2>
            <p className="text-[15px] text-zinc-500 mt-0.5">Schedule a new patient visit.</p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100/80 rounded-full transition-all">
            <X size={22} strokeWidth={2} />
          </button>
        </div>

        <div className="px-8 pb-4 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Patient Name *</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User size={18} className="text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input type="text" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} placeholder="e.g. John Doe" className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] pl-10 pr-4 py-3 text-zinc-900 text-[15px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone size={18} className="text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] pl-10 pr-4 py-3 text-zinc-900 text-[15px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Treatment Type</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Activity size={18} className="text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input type="text" value={formData.treatmentType} onChange={(e) => setFormData({...formData, treatmentType: e.target.value})} placeholder="e.g. Root Canal, Teeth Whitening" className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] pl-10 pr-4 py-3 text-zinc-900 text-[15px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-zinc-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-2">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Date *</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <CalendarIcon size={18} className="text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] pl-10 pr-4 py-3 text-zinc-900 text-[15px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide ml-1">Time *</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Clock size={18} className="text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full bg-zinc-100/70 border border-transparent rounded-[14px] pl-10 pr-4 py-3 text-zinc-900 text-[15px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-5 flex items-center justify-end gap-3 bg-zinc-50/50 border-t border-zinc-100">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full font-medium text-[15px] text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 transition-all active:scale-95">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-[15px] text-white bg-zinc-900 hover:bg-black shadow-[0_2px_10px_rgba(0,0,0,0.1)] disabled:opacity-70 transition-all active:scale-95">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
            Confirm Booking
          </button>
        </div>

      </div>
    </div>
  );
};

// --- MAIN PARENT COMPONENT ---
export default function AppointmentsClient({ initialAppointments, onAppointmentAdded }: { initialAppointments: Appointment[]; onAppointmentAdded: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sidebarMode, setSidebarMode] = useState<'calendar' | 'strip'>('calendar');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingApptId, setViewingApptId] = useState<string | null>(null);

  // ✅ SAFE LOCAL DATE FORMATTER (NO UTC)
  function formatLocalDate(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const selectedDateString = formatLocalDate(selectedDate);

  const todaysAppointments = initialAppointments.filter(
    (app) => app.date === selectedDateString
  );
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative font-sans text-zinc-900 bg-[#fbfbfd] min-h-screen">
      
      {/* Apple-style header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-[32px] font-bold tracking-tight text-zinc-900 leading-tight">Appointments</h1>
          <p className="text-[15px] text-zinc-500 mt-1">Manage your daily schedule and upcoming bookings.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-semibold text-[15px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all active:scale-95">
          <Plus size={18} strokeWidth={2.5} />
          New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8">
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
      
      <AppointmentDetailModal appointmentId={viewingApptId} onClose={() => setViewingApptId(null)} />
    </div>
  );
}