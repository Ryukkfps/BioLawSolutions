'use client';

import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function AppointmentCalendar({ appointments, onDateSelect }: { appointments: { id: string; date: string; time: string; name: string; status: string }[], onDateSelect: (date: Date) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = [];
  const totalDays = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);

  // Previous month padding
  for (let i = 0; i < offset; i++) {
    days.push(<div key={`prev-${i}`} className="h-24 border border-gray-100 bg-gray-50/50"></div>);
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month, d);
    const dateStr = date.toISOString().split('T')[0];
    const dayAppointments = appointments.filter(a => new Date(a.date).toISOString().split('T')[0] === dateStr);
    
    days.push(
      <div 
        key={d} 
        className="h-24 border border-gray-100 p-2 hover:bg-gray-50 cursor-pointer transition-colors overflow-y-auto"
        onClick={() => onDateSelect(date)}
      >
        <span className="text-xs font-bold text-gray-400">{d}</span>
        <div className="mt-1 space-y-1">
          {dayAppointments.map((a) => (
            <div 
              key={a.id} 
              className={`text-[8px] px-1 py-0.5 rounded truncate ${
                a.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 
                a.status === 'PENDING' ? 'bg-blue-100 text-blue-700' : 
                'bg-gray-100 text-gray-600'
              }`}
            >
              {a.time} - {a.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <h3 className="text-lg font-serif font-light text-[#004d66] uppercase tracking-widest">
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-r border-gray-100 last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days}
      </div>
    </div>
  );
}
