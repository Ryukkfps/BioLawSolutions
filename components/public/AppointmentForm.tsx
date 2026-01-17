'use client';

import { useState, useEffect } from 'react';
import UserAppointmentCalendar from './UserAppointmentCalendar';
import { getUnavailableDates } from '@/lib/actions/appointments';

interface UnavailableSlot {
  date: Date;
  time: string;
}

export default function AppointmentForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<UnavailableSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    time: '',
    service: 'General Consultation',
    message: '',
  });

  useEffect(() => {
    const fetchUnavailable = async () => {
      const dates = await getUnavailableDates();
      setUnavailableDates(dates);
    };
    fetchUnavailable();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: selectedDate.toISOString(),
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          time: '',
          service: 'General Consultation',
          message: '',
        });
        setSelectedDate(null);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getScheduleForDate = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dayAppointments = unavailableDates.filter(u => new Date(u.date).toISOString().split('T')[0] === dateStr);
    
    const isWholeDayBlocked = dayAppointments.some(u => u.time === 'ALL_DAY');
    if (isWholeDayBlocked) return [{ time: 'ALL_DAY', status: 'BLOCKED' }];

    const allTimes = [
      "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ];

    return allTimes.map(time => {
      const booking = dayAppointments.find(a => a.time === time);
      return {
        time,
        status: booking ? (booking.status === 'BLOCKED' ? 'BLOCKED' : 'BOOKED') : 'AVAILABLE'
      };
    });
  };

  const getAvailableTimes = () => {
    const schedule = getScheduleForDate();
    if (schedule.length === 1 && schedule[0].time === 'ALL_DAY') return [];
    return schedule.filter(s => s.status === 'AVAILABLE').map(s => s.time);
  };

  if (success) {
    return (
      <div className="bg-green-50 p-8 rounded-xl border border-green-100 text-center space-y-4">
        <h3 className="text-xl font-serif text-green-800">Appointment Requested!</h3>
        <p className="text-green-700 text-sm">
          Thank you for reaching out. We will review your request and contact you shortly to confirm the appointment.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-xs font-bold uppercase tracking-widest text-green-800 hover:underline"
        >
          Book another appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66] text-gray-900 placeholder-gray-600"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66] text-gray-900 placeholder-gray-600"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Date</label>
          <UserAppointmentCalendar 
            unavailableDates={unavailableDates}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66] text-gray-900 placeholder-gray-600"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Times</label>
            <select
              required
              disabled={!selectedDate}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66] text-gray-900 disabled:opacity-50"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            >
              <option value="">{selectedDate ? 'Select Time' : 'Select a date first'}</option>
              {getAvailableTimes().map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            
            {selectedDate && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Today's Schedule</h4>
                <div className="grid grid-cols-2 gap-2">
                  {getScheduleForDate().map((slot, i) => (
                    <div 
                      key={i} 
                      className={`text-[10px] px-2 py-1.5 rounded border flex justify-between items-center ${
                        slot.status === 'AVAILABLE' ? 'bg-white border-gray-100 text-gray-600' :
                        slot.status === 'BOOKED' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                        'bg-red-50 border-red-100 text-red-600'
                      }`}
                    >
                      <span>{slot.time === 'ALL_DAY' ? 'WHOLE DAY' : slot.time}</span>
                      <span className="font-bold">{slot.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && getAvailableTimes().length === 0 && (
              <p className="text-red-500 text-[10px] mt-1 italic">No slots available for this date.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service Needed</label>
            <select
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66] text-gray-900"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            >
              <option>General Consultation</option>
              <option>Biotech IP Law</option>
              <option>Corporate Compliance</option>
              <option>Regulatory Affairs</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message (Optional)</label>
        <textarea
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66] text-gray-900 placeholder-gray-600"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Additional details about your legal needs (optional)"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !selectedDate || !formData.time}
        className="w-full bg-[#004d66] text-white py-4 px-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#003d52] transition-all disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Request Appointment'}
      </button>
    </form>
  );
}
