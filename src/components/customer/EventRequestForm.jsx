import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, IndianRupee, Users, CheckSquare, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const EventRequestForm = ({ onBack, onSuccess }) => {
  const { currentUser } = useAuth();
  const { createCustomerRequest } = useDatabase();

  const [eventName, setEventName] = useState('My Wedding');
  const [eventType, setEventType] = useState('Wedding');
  const [eventDate, setEventDate] = useState('15 Dec 2026');
  const [location, setLocation] = useState('Bengaluru');
  const [budget, setBudget] = useState('3,00,000');
  const [guestCount, setGuestCount] = useState('250');
  const [requiredServices, setRequiredServices] = useState(['Catering', 'Decoration', 'Photography']);
  const [loading, setLoading] = useState(false);

  const availableServices = [
    'Catering',
    'Decoration',
    'Photography',
    'Venue',
    'Music',
    'Lighting'
  ];

  const toggleService = (srv) => {
    setRequiredServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName.trim() || !eventDate.trim() || !location.trim()) {
      alert('Please fill in event name, date and location.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const cleanBudget = Number(budget.replace(/[^0-9]/g, '')) || 300000;
      createCustomerRequest(
        {
          eventName,
          eventType,
          eventDate,
          location,
          budget: cleanBudget,
          guestCount: Number(guestCount) || 150,
          requiredServices
        },
        currentUser
      );

      setLoading(false);
      onSuccess?.();
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Top Header matching reference image: `< Plan an Event` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        <button
          onClick={onBack}
          className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-black tracking-tight text-white">Plan an Event</h2>
      </div>

      {/* Form Body matching reference layout */}
      <form onSubmit={handleSubmit} className="flex-1 p-5 overflow-y-auto no-scrollbar space-y-4">
        <div className="p-5 rounded-3xl bg-white border border-[#EDE0D7] shadow-xs space-y-3.5">
          {/* Event Name */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1">Event Name</label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. My Wedding"
              className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 px-3 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1">Event Type</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 px-3 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
            >
              <option value="Wedding">Wedding</option>
              <option value="Birthday">Birthday</option>
              <option value="Graduation">Graduation</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1">Event Date</label>
            <div className="relative">
              <input
                type="text"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="15 Dec 2026"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 pl-3 pr-10 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
              />
              <Calendar className="w-4 h-4 absolute right-3.5 top-3 text-[#8B7377]" />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1">Location</label>
            <div className="relative">
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bengaluru"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 pl-3 pr-10 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
              />
              <MapPin className="w-4 h-4 absolute right-3.5 top-3 text-[#8B7377]" />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1">Budget (₹)</label>
            <div className="relative">
              <input
                type="text"
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="3,00,000"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 pl-3 pr-10 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
              />
              <IndianRupee className="w-4 h-4 absolute right-3.5 top-3 text-[#8B7377]" />
            </div>
          </div>

          {/* Guest Count */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1">Estimated Guests</label>
            <div className="relative">
              <input
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                placeholder="250"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 pl-3 pr-10 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718]"
              />
              <Users className="w-4 h-4 absolute right-3.5 top-3 text-[#8B7377]" />
            </div>
          </div>

          {/* Required Services */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1.5">Required Services</label>
            <div className="grid grid-cols-2 gap-2">
              {availableServices.map((srv) => {
                const checked = requiredServices.includes(srv);
                return (
                  <button
                    key={srv}
                    type="button"
                    onClick={() => toggleService(srv)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left ${
                      checked
                        ? 'bg-[#4B0718] border-[#4B0718] text-white'
                        : 'bg-[#FFF8F3] border-[#EDE0D7] text-[#260C13]'
                    }`}
                  >
                    <span className="text-[10px] font-bold">{checked ? '✔' : '+'}</span>
                    <span>{srv}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit Button matching reference: Next */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#4B0718] hover:bg-[#350713] active:scale-98 text-white font-bold text-base shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Submitting Requirement...' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};
