"use client";
import React, { useEffect, useState } from 'react';
import AppointmentsClient from "@/components/appointments/AppointmentsClient";
import { getAppointmentsAction } from '@/actions/appointmentActions';
import { Loader2 } from 'lucide-react';


export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    setIsLoading(true);
    const data = await getAppointmentsAction();
    setAppointments(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppointmentsClient 
        initialAppointments={appointments} 
        onAppointmentAdded={fetchAppointments} 
      />
    </div>
  );
}