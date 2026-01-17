'use client';

import { useState } from 'react';
import { updateAppointmentStatus, deleteAppointment, blockDate } from '@/lib/actions/appointments';
import AppointmentCalendar from './AppointmentCalendar';
import { 
  Check, 
  X, 
  Trash2, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare,
  AlertCircle,
  Lock
} from 'lucide-react';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  message: string | null;
  status: string;
}

export default function AppointmentManager({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isBlocking, setIsBlocking] = useState(false);
  const [blockTime, setBlockTime] = useState('ALL_DAY');

  const pendingAppointments = appointments.filter(a => a.status === 'PENDING');
  const otherAppointments = appointments.filter(a => a.status !== 'PENDING');

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await deleteAppointment(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      alert('Failed to delete appointment');
    }
  };

  const handleBlockDate = async () => {
    if (!selectedDate) return;
    try {
      const newBlock = await blockDate(selectedDate, blockTime);
      const serializedBlock: Appointment = {
        id: newBlock.id,
        name: newBlock.name,
        email: newBlock.email,
        phone: newBlock.phone,
        date: newBlock.date.toISOString(),
        time: newBlock.time,
        service: newBlock.service,
        message: newBlock.message,
        status: newBlock.status,
      };
      setAppointments(prev => [...prev, serializedBlock]);
      setIsBlocking(false);
    } catch (error) {
      alert('Failed to block date');
    }
  };

  const filteredByDate = selectedDate 
    ? appointments.filter(a => new Date(a.date).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0])
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Calendar & Selected Date Details */}
      <div className="lg:col-span-2 space-y-8">
        <AppointmentCalendar 
          appointments={appointments} 
          onDateSelect={(date) => {
            setSelectedDate(date);
            setIsBlocking(false);
          }} 
        />

        {selectedDate && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-serif text-[#004d66] uppercase tracking-wider">
                Appointments for {selectedDate.toLocaleDateString('en-US', { dateStyle: 'long' })}
              </h3>
              <button 
                onClick={() => setIsBlocking(true)}
                className="text-sm bg-[#004d66] text-white px-4 py-2 rounded-lg hover:bg-[#003d52] transition-colors flex items-center gap-2"
              >
                <Lock className="w-4 h-4" /> Block This Date
              </button>
            </div>
            
            <div className="p-4">
              {isBlocking && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Block Date/Time
                  </h4>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="block text-xs text-blue-600 mb-1">Time to block</label>
                      <select 
                        value={blockTime}
                        onChange={(e) => setBlockTime(e.target.value)}
                        className="w-full border border-blue-200 rounded px-2 py-1 text-sm"
                      >
                        <option value="ALL_DAY">Whole Day</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="05:00 PM">05:00 PM</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleBlockDate}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 whitespace-nowrap"
                      >
                        Confirm Block
                      </button>
                      <button 
                        onClick={() => setIsBlocking(false)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {filteredByDate.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No appointments scheduled for this date.</p>
              ) : (
                <div className="space-y-4">
                  {filteredByDate.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4 items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          app.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' :
                          app.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                          app.status === 'BLOCKED' ? 'bg-gray-100 text-gray-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {app.status === 'BLOCKED' ? <Lock className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{app.name} {app.status === 'BLOCKED' && '(Blocked Slot)'}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {app.time}</span>
                            {app.service !== 'N/A' && <span>{app.service}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {app.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Accept"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(app.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Pending Requests */}
      <div className="space-y-6">
        <h3 className="text-xl font-serif text-[#004d66] uppercase tracking-widest flex items-center gap-2">
          Pending Requests <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">{pendingAppointments.length}</span>
        </h3>
        
        {pendingAppointments.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-dashed border-gray-200 text-center">
            <p className="text-gray-500">No pending requests</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
            {pendingAppointments.map((app) => (
              <div key={app.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{app.name}</h4>
                    <p className="text-xs text-gray-500">Requested on {new Date(app.date).toLocaleDateString()}</p>
                  </div>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {app.time}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" /> {app.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" /> {app.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" /> {app.service}
                  </div>
                  {app.message && (
                    <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-100 text-xs italic">
                      <MessageSquare className="w-3 h-3 inline mr-1 mb-1" /> "{app.message}"
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Accept
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(app.id, 'REJECTED')}
                    className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-8 border-t border-gray-100">
          <h3 className="text-lg font-serif text-[#004d66] uppercase tracking-widest mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {otherAppointments.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    app.status === 'ACCEPTED' ? 'bg-green-500' : 
                    app.status === 'REJECTED' ? 'bg-red-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-gray-700 truncate max-w-[120px]">{app.name}</span>
                </div>
                <span className="text-gray-400 text-xs">{new Date(app.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
