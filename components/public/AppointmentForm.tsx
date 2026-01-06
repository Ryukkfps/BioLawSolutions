'use client';

import { useState } from 'react';

export default function AppointmentForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: 'General Consultation',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          service: 'General Consultation',
          message: '',
        });
      }
    } catch (error) {
      console.error(error);
      alert('Failed to book appointment');
    } finally {
      setLoading(false);
    }
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
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66]"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66]"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone</label>
          <input
            type="tel"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66]"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preferred Date</label>
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66]"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preferred Time</label>
          <select
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66]"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          >
            <option value="">Select Time</option>
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
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service Needed</label>
        <select
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66]"
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
        >
          <option>General Consultation</option>
          <option>Biotech IP Law</option>
          <option>Corporate Compliance</option>
          <option>Regulatory Affairs</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Message (Optional)</label>
        <textarea
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-[#004d66]"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#004d66] text-white py-4 px-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#003d52] transition-all disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Request Appointment'}
      </button>
    </form>
  );
}
