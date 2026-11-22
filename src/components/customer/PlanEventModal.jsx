import React, { useState } from 'react';
import {
  X,
  Calendar,
  MapPin,
  IndianRupee,
  Users,
  CheckSquare,
  Sparkles,
  Clock,
  FileText
} from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';

export const PlanEventModal = ({ isOpen, onClose, onSuccess, prefilledCompany }) => {
  const { createCustomerRequest } = useDatabase();
  const { currentUser } = useAuth();

  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('Wedding');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('06:00 PM - 11:30 PM');
  const [location, setLocation] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState('200');
  const [requiredServices, setRequiredServices] = useState([
    'Catering',
    'Decoration',
    'Photography'
  ]);
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const eventTypes = [
    'Wedding',
    'Birthday',
    'Graduation',
    'Corporate Event',
    'Anniversary',
    'Other'
  ];

  const availableServices = [
    'Catering',
    'Decoration',
    'Photography',
    'Venue',
    'Music',
    'Lighting',
    'Security',
    'Hosting'
  ];

  const toggleService = (srv) => {
    setRequiredServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName.trim() || !eventDate || !location.trim() || !estimatedBudget) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      createCustomerRequest(
        {
          eventName: eventName.trim(),
          eventType,
          eventDate,
          eventTime,
          location: location.trim(),
          estimatedBudget: Number(estimatedBudget),
          numberOfGuests: Number(numberOfGuests) || 100,
          requiredServices,
          additionalRequirements:
            additionalRequirements.trim() ||
            (prefilledCompany ? `Requested specifically from ${prefilledCompany}` : '')
        },
        currentUser
      );

      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onSuccess?.();
        onClose();
      }, 1200);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-[#0E1528] border border-purple-900/40 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#111A33]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Plan an Event</h3>
              <p className="text-[11px] text-slate-400">
                {prefilledCompany ? `Requesting proposal from ${prefilledCompany}` : 'Post requirements to receive manager bids'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        {submitted ? (
          <div className="p-8 text-center my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Event Requirement Posted!</h4>
            <p className="text-xs text-slate-400 mt-1">
              Top event managers will review your budget & submit customized proposals shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {/* Event Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Event Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Rohit & Tanya Wedding Sangeet"
                className="w-full bg-[#141C35] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Event Type Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Event Type <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {eventTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEventType(type)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition border ${
                      eventType === type
                        ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/30'
                        : 'bg-[#141C35] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Event Date <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#141C35] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Timing
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="06:00 PM - 11:30 PM"
                    className="w-full bg-[#141C35] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Location & Guests */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Event Location <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City / Banquet Venue"
                    className="w-full bg-[#141C35] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Estimated Guests
                </label>
                <div className="relative">
                  <Users className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="number"
                    value={numberOfGuests}
                    onChange={(e) => setNumberOfGuests(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full bg-[#141C35] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Estimated Budget */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Estimated Budget (INR ₹) <span className="text-rose-400">*</span>
                </label>
                {estimatedBudget && (
                  <span className="text-xs font-bold text-purple-400">
                    ₹{Number(estimatedBudget).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="number"
                  required
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                  placeholder="e.g. 500000"
                  className="w-full bg-[#141C35] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-1.5 mt-2">
                {[150000, 350000, 600000, 1000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setEstimatedBudget(amt.toString())}
                    className="text-[10px] py-1 px-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    ₹{(amt / 100000).toFixed(1)}L
                  </button>
                ))}
              </div>
            </div>

            {/* Required Services */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Required Services ({requiredServices.length} selected)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableServices.map((service) => {
                  const isChecked = requiredServices.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium border text-left transition ${
                        isChecked
                          ? 'bg-purple-950/40 border-purple-600/50 text-purple-200'
                          : 'bg-[#141C35] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isChecked ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-600'
                        }`}
                      >
                        {isChecked && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                      <span className="truncate">{service}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Requirements */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Additional Requirements / Vision
              </label>
              <textarea
                rows={2}
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="Mention theme preferences, cuisine choices, sound regulations, or specific decor inspirations..."
                className="w-full bg-[#141C35] border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 pb-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition active:scale-98 disabled:opacity-50"
              >
                {loading ? 'Submitting Requirement...' : 'Submit Requirement'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
