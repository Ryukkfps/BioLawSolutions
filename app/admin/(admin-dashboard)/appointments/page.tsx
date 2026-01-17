import { getAppointments } from '@/lib/actions/appointments';
import AppointmentManager from '@/components/admin/AppointmentManager';

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  // Convert dates to string for serialization to client component
  const serializedAppointments = appointments.map(a => ({
    ...a,
    date: a.date.toISOString(),
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#004d66] uppercase tracking-widest">
          Appointments Management
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage client appointment requests and schedule blocks.
        </p>
      </div>

      <AppointmentManager initialAppointments={serializedAppointments} />
    </div>
  );
}
