"use client";
import React from 'react';
import { Phone, MoreHorizontal, CalendarX } from 'lucide-react';
import { Appointment } from './AppointmentsClient';

export default function DailySchedule({ 
  date, 
  appointments, 
  onSelectAppt 
}: { 
  date: Date, 
  appointments: Appointment[], 
  onSelectAppt: (id: string) => void 
}) {
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="bg-white rounded-[28px] border border-zinc-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden font-sans">
      
      {/* Header */}
      <div className="px-7 py-5 flex items-center justify-between border-b border-zinc-100 bg-zinc-50/30">
        <h2 className="text-[19px] font-semibold tracking-tight text-zinc-900">{formattedDate}</h2>
        <span className="text-[13px] font-medium text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200/50">
          {appointments.length} Appointments
        </span>
      </div>

      <div className="p-6">
        {appointments.length > 0 ? (
          <div className="space-y-3.5">
            {appointments.map((app) => (
              <div 
                key={app._id} 
                onClick={() => onSelectAppt(app._id)}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 rounded-[20px] border border-zinc-200/70 hover:border-zinc-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all bg-white cursor-pointer active:scale-[0.99] origin-center"
              >
                
                {/* Time Block */}
                <div className="w-24 flex-shrink-0 border-l-[3px] border-blue-500 pl-4 py-0.5 rounded-l-[2px]">
                  <span className="text-[17px] font-semibold text-zinc-900 tracking-tight block leading-none mb-1">
                    {app.time.split(' ')[0]}
                  </span>
                  <span className="text-[13px] font-medium text-zinc-500">
                    {app.time.split(' ')[1]}
                  </span>
                </div>

                {/* Patient Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[17px] font-semibold text-zinc-900 tracking-tight truncate group-hover:text-blue-500 transition-colors">
                    {app.patientName}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="bg-zinc-100 border border-zinc-200/50 px-2.5 py-1 rounded-[8px] text-[12px] font-medium text-zinc-600">
                      {app.treatmentType || 'Consultation'}
                    </span>
                    <span className="flex items-center gap-1.5 text-[13px] font-medium text-zinc-500">
                      <Phone size={13} className="text-zinc-400" /> {app.bookedByPhone}
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <span className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-full border ${
                    app.status === 'confirmed' 
                      ? 'bg-green-50 text-green-700 border-green-200/60' 
                      : 'bg-orange-50 text-orange-700 border-orange-200/60'
                  }`}>
                    {app.status}
                  </span>
                  <button className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors active:bg-zinc-200">
                    <MoreHorizontal size={20} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4 border border-zinc-100">
              <CalendarX size={26} className="text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-[17px] font-semibold text-zinc-900 tracking-tight">No appointments scheduled</h3>
            <p className="text-[14px] text-zinc-500 mt-1.5 max-w-sm font-medium">
              You have a free schedule on this date. Click 'New Appointment' to book a patient.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}