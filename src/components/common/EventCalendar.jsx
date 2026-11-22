import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Sparkles,
  X
} from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

export const EventCalendar = ({ onBack, onSelectEvent }) => {
  const { bookings, requests } = useDatabase();
  const [selectedDate, setSelectedDate] = useState(14);
  const [currentMonth, setCurrentMonth] = useState('Dec 2026');

  // Days of December 2026: Dec 1, 2026 is a Tuesday (starts at column 3, 0-indexed column 2)
  const daysInMonth = 31;
  const startDayOffset = 2; // Tuesday

  // Event dots mapping matching reference mockup:
  // 10: Proposal (In Planning / Proposal)
  // 14: Confirmed (Wedding Priya & Arjun)
  // 18: In Planning (Corporate Meetup Nexa)
  // 25: Birthday Celebration
  // 31: New Year Gala
  const eventsByDay = {
    10: [
      { id: 'ev_10', title: 'Tech Expo Proposal', type: 'proposal', time: '11:00 AM', location: 'Palace Grounds' }
    ],
    14: [
      { id: 'ev_14', title: 'Wedding – Priya & Arjun', type: 'confirmed', time: '04:00 PM', location: 'Grand Orchid Hall' }
    ],
    18: [
      { id: 'ev_18', title: 'Corporate Meetup – Nexa', type: 'planning', time: '09:30 AM', location: 'Whitefield Marriott' }
    ],
    25: [
      { id: 'ev_25', title: 'Christmas Gala Banquet', type: 'confirmed', time: '07:00 PM', location: 'Indiranagar Club' }
    ],
    31: [
      { id: 'ev_31', title: 'New Year Eve Production', type: 'confirmed', time: '08:00 PM', location: 'Sheraton Grand' }
    ]
  };

  const selectedEvents = eventsByDay[selectedDate] || [];

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#242424]">Event Calendar</h1>
          <p className="text-xs text-[#736B66] mt-0.5">
            Master schedule of bookings, setup shifts, and pending client proposals.
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-[#736B66] hover:bg-[#F8F7F5] border border-[#EAE5DE]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid matching reference mockup bottom-center-right */}
        <div className="md:col-span-7 p-6 rounded-3xl bg-white border border-[#EAE5DE] shadow-xs space-y-5">
          {/* Month Header with < > arrows */}
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DE]">
            <button className="p-1.5 rounded-lg text-[#736B66] hover:bg-[#F8F7F5]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-[#242424]">{currentMonth}</span>
            <button className="p-1.5 rounded-lg text-[#736B66] hover:bg-[#F8F7F5]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#736B66]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <span key={day} className="py-1">{day}</span>
            ))}
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {/* Empty slots for month start offset */}
            {Array.from({ length: startDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}

            {/* Days 1 to 31 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const hasEvents = eventsByDay[dayNum];
              const isSelected = selectedDate === dayNum;

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDate(dayNum)}
                  className={`h-10 rounded-xl flex flex-col items-center justify-center relative transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#4B0718] text-white font-bold shadow-xs'
                      : 'hover:bg-[#F8F7F5] text-[#242424]'
                  }`}
                >
                  <span className="text-xs">{dayNum}</span>

                  {/* Colored status dot */}
                  {hasEvents && (
                    <div className="flex gap-0.5 mt-0.5">
                      {hasEvents.map((evt, idx) => (
                        <span
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            evt.type === 'confirmed'
                              ? isSelected ? 'bg-amber-300' : 'bg-[#4B0718]'
                              : evt.type === 'planning'
                              ? isSelected ? 'bg-amber-200' : 'bg-amber-500'
                              : isSelected ? 'bg-white' : 'bg-indigo-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend matching reference mockup bottom-center-right */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-[#EAE5DE] text-xs text-[#736B66]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4B0718]" />
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>In Planning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>Proposal</span>
            </div>
          </div>
        </div>

        {/* Selected Date Schedule Sidebar */}
        <div className="md:col-span-5 p-6 rounded-3xl bg-white border border-[#EAE5DE] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DE]">
            <div>
              <span className="text-xs text-[#736B66] uppercase tracking-wider font-bold">Schedule</span>
              <h3 className="text-base font-bold text-[#242424]">Dec {selectedDate}, 2026</h3>
            </div>
            <span className="text-xs font-bold text-[#4B0718] bg-[#FFF8F3] px-2.5 py-1 rounded-full border border-[#EAE5DE]">
              {selectedEvents.length} Event{selectedEvents.length === 1 ? '' : 's'}
            </span>
          </div>

          {selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent ? onSelectEvent(evt) : null}
                  className="p-3.5 rounded-2xl bg-[#FFF8F3] border border-[#EAE5DE] space-y-1.5 cursor-pointer hover:border-[#4B0718]/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#242424]">{evt.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        evt.type === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : evt.type === 'planning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {evt.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-[#736B66]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {evt.time}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {evt.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-[#736B66] bg-[#F8F7F5] rounded-2xl border border-[#EAE5DE]">
              <CalendarIcon className="w-6 h-6 mx-auto mb-2 text-[#736B66]/60" />
              <span>No events scheduled for this date.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
