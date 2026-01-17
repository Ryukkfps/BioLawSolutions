'use client';

import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface UnavailableDate {
  date: Date;
  time: string;
}

export default function UserAppointmentCalendar({ 
  unavailableDates, 
  onDateSelect,
  selectedDate 
}: { 
  unavailableDates: UnavailableDate[], 
  onDateSelect: (date: Date) => void,
  selectedDate: Date | null
}) {
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
    days.push(<div key={`prev-${i}`} className="h-12 border border-gray-50 bg-gray-50/30"></div>);
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month, d);
    const dateStr = date.toISOString().split('T')[0];
    const isToday = new Date().toISOString().split('T')[0] === dateStr;
    const isPast = date < new Date(new Date().setHours(0,0,0,0));
    const isSelected = selectedDate?.toISOString().split('T')[0] === dateStr;
    
    // Check if whole day is blocked
    const dayUnavailable = unavailableDates.filter(u => new Date(u.date).toISOString().split('T')[0] === dateStr);
    const isManuallyBlocked = dayUnavailable.some(u => u.time === 'ALL_DAY');
    const isFullyBooked = dayUnavailable.length >= 8; 
    const isDisabled = isPast || isManuallyBlocked || isFullyBooked;

    days.push(
      <button 
        key={d} 
        type="button"
        disabled={isDisabled}
        className={`h-12 border border-gray-50 flex flex-col items-center justify-center transition-colors relative
          ${isDisabled ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}
          ${isSelected ? 'bg-[#004d66] text-white hover:bg-[#004d66]' : ''}
          ${isToday && !isSelected ? 'text-[#004d66] font-bold' : ''}
          ${isManuallyBlocked && !isPast && !isSelected ? 'bg-red-50' : ''}
        `}
        onClick={() => onDateSelect(date)}
      >
        <span className="text-sm">{d}</span>
        {isManuallyBlocked && !isPast && !isSelected && (
          <span className="text-[7px] text-red-500 font-bold uppercase absolute top-1">Blocked</span>
        )}
        {!isManuallyBlocked && dayUnavailable.length > 0 && !isPast && !isSelected && (
          <div className="absolute bottom-1 flex gap-0.5">
            {dayUnavailable.slice(0, 3).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-orange-400"></div>
            ))}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-3 flex items-center justify-between border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-bold text-[#004d66] uppercase tracking-wider">
          {monthNames[month]} {year}
        </h3>
        <div className="flex gap-1">
          <button 
            type="button"
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            type="button"
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 bg-white">
        {["S", "M", "T", "W", "Th", "F", "Sa"].map((day, index) => (
          <div key={`${day}-${index}`} className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days}
      </div>
      <div className="p-2 bg-gray-50 border-t border-gray-100 flex justify-between text-[10px] text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#004d66]"></div> Selected
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-400"></div> Booked
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-100 border border-red-200"></div> Blocked
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div> Full/Past
        </div>
      </div>
    </div>
  );
}
