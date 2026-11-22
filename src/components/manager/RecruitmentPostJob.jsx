import React, { useState } from 'react';
import { ArrowLeft, Briefcase, Calendar, MapPin, IndianRupee, Users, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const RecruitmentPostJob = ({ onBack, onSuccess }) => {
  const { currentUser } = useAuth();
  const { bookings, createJobListing } = useDatabase();

  const myBookings = bookings.filter((b) => b.managerId === currentUser?.id);

  const [eventName, setEventName] = useState(
    myBookings[0] ? `${myBookings[0].eventName} - ${myBookings[0].customerName}` : 'Wedding - Kirthana'
  );
  const [jobTitle, setJobTitle] = useState('Catering Staff');
  const [workersRequired, setWorkersRequired] = useState('10');
  const [salaryPerDay, setSalaryPerDay] = useState('800');
  const [location, setLocation] = useState('Bengaluru');
  const [date, setDate] = useState('15 Dec 2026');
  const [startTime, setStartTime] = useState('04:00 PM');
  const [endTime, setEndTime] = useState('11:00 PM');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobTitle || !salaryPerDay) {
      alert('Please fill in job title and salary.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      createJobListing(
        {
          eventName,
          jobTitle,
          workersRequired: Number(workersRequired) || 5,
          salaryPerDay: Number(salaryPerDay) || 800,
          location,
          date,
          startTime,
          endTime
        },
        currentUser
      );

      setLoading(false);
      onSuccess?.();
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Top Header matching reference image: `< Post a Job` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        <button
          onClick={onBack}
          className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-black tracking-tight text-white">Post a Job</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-5 overflow-y-auto no-scrollbar space-y-4">
        <div className="p-5 rounded-3xl bg-white border border-[#EDE0D7] shadow-xs space-y-3.5">
          {/* Associated Event */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1">Event</label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Wedding - Kirthana"
              className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 px-3 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1">Job Title</label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Catering Staff"
              className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 px-3 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
            />
          </div>

          {/* Number of Workers */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1">Number of Workers</label>
            <div className="relative">
              <input
                type="number"
                min="1"
                required
                value={workersRequired}
                onChange={(e) => setWorkersRequired(e.target.value)}
                placeholder="10"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 pl-3 pr-10 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
              />
              <Users className="w-4 h-4 absolute right-3.5 top-3 text-[#8B7377]" />
            </div>
          </div>

          {/* Payment (₹/day) */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1">Payment (₹/day)</label>
            <div className="relative">
              <input
                type="number"
                required
                value={salaryPerDay}
                onChange={(e) => setSalaryPerDay(e.target.value)}
                placeholder="800"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 pl-3 pr-10 text-xs font-bold text-[#4B0718] focus:outline-none focus:border-[#4B0718]"
              />
              <IndianRupee className="w-4 h-4 absolute right-3.5 top-3 text-[#8B7377]" />
            </div>
          </div>

          {/* Location & Date */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-[#260C13] mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bengaluru"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 px-3 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#260C13] mb-1">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="15 Dec 2026"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 px-3 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
              />
            </div>
          </div>

          {/* Timings */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-[#260C13] mb-1">Start Time</label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="04:00 PM"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 px-3 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#260C13] mb-1">End Time</label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="11:00 PM"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 px-3 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
              />
            </div>
          </div>
        </div>

        {/* Burgundy Post Job button matching reference */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#4B0718] hover:bg-[#350713] active:scale-98 text-white font-bold text-base shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Publishing Opening...' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};
