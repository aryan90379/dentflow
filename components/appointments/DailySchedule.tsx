"use client";
import React from 'react';
import { Clock, Phone, MoreHorizontal, CalendarX } from 'lucide-react';
import { Appointment } from './AppointmentsClient';

export default function DailySchedule({ date, appointments }: { date: Date, appointments: Appointment[] }) {
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800">{formattedDate}</h2>
        <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          {appointments.length} Appointments
        </span>
      </div>

      <div className="p-6">
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((app) => (
              <div 
                key={app.id} 
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white cursor-pointer"
              >
                {/* Time Block */}
                <div className="w-32 flex-shrink-0 border-l-4 border-indigo-500 pl-4">
                  <span className="text-lg font-black text-slate-900 block">{app.time.split(' ')[0]}</span>
                  <span className="text-xs font-bold text-slate-400">{app.time.split(' ')[1]}</span>
                </div>

                {/* Patient Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{app.patient}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm font-medium text-slate-500">
                    <span className="bg-slate-100 px-2.5 py-0.5 rounded-md text-slate-600">{app.treatment}</span>
                    <span className="flex items-center gap-1">
                      <Phone size={14} /> {app.phone}
                    </span>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${
                    app.status === 'confirmed' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {app.status}
                  </span>
                  <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <CalendarX size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No appointments scheduled</h3>
            <p className="text-slate-500 mt-1 max-w-sm">You have a free schedule on this date. Click 'New Appointment' to book a patient.</p>
          </div>
        )}
      </div>
    </div>
  );
}