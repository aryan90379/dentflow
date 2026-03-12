import AppointmentsClient from "@/components/appointments/AppointmentsClient";

// Mock Data - In a real app, fetch this from your DB/API here
const MOCK_APPOINTMENTS = [
  { id: '1', date: '2026-03-12', time: '09:00 AM', patient: 'Divya Rao', treatment: 'Follow-up Checkup', phone: '+91 98765 43210', status: 'confirmed' },
  { id: '2', date: '2026-03-12', time: '11:30 AM', patient: 'Priya Sharma', treatment: 'Teeth Whitening', phone: '+91 98765 11111', status: 'pending' },
  { id: '3', date: '2026-03-12', time: '02:15 PM', patient: 'Rahul Gupta', treatment: 'Root Canal', phone: '+91 98765 22222', status: 'confirmed' },
  { id: '4', date: '2026-03-13', time: '10:00 AM', patient: 'Ananya Joshi', treatment: 'Consultation', phone: '+91 98765 33333', status: 'pending' },
  { id: '5', date: '2026-03-15', time: '04:00 PM', patient: 'Vikram Singh', treatment: 'Implant Surgery', phone: '+91 98765 44444', status: 'confirmed' },
];

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <AppointmentsClient initialAppointments={MOCK_APPOINTMENTS} />
    </div>
  );
}