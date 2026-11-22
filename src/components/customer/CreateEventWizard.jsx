import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const CreateEventWizard = ({ onBack, onSuccess, initialCategory }) => {
  const { currentUser } = useAuth();
  const { createCustomerRequest } = useDatabase();

  const [step, setStep] = useState(1); // 1: Details, 2: Requirements, 3: Budget, 4: Review

  // Form State
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState(initialCategory || 'Birthday Celebration');
  const [eventDate, setEventDate] = useState('2026-12-25');
  const [location, setLocation] = useState('Bangalore');

  const [guestCount, setGuestCount] = useState(150);
  const [requiredServices, setRequiredServices] = useState(['Decoration', 'Catering']);

  const [budget, setBudget] = useState(250000);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const serviceOptions = [
    'Stage Decoration',
    'Catering & Buffet',
    'Photography & Video',
    'A/V Sound & Mic Array',
    'Pro Lighting Rig',
    'Event Coordinator',
    'Anchor / Emcee',
    'Banquet Stewards'
  ];

  const toggleService = (srv) => {
    setRequiredServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!eventName.trim()) {
        setError('Please enter an event title.');
        return;
      }
      if (!location.trim()) {
        setError('Please specify the event city or location.');
        return;
      }
    } else if (step === 2) {
      if (requiredServices.length === 0) {
        setError('Please select at least one required service.');
        return;
      }
    } else if (step === 3) {
      if (!budget || budget <= 0) {
        setError('Please specify a realistic estimated budget.');
        return;
      }
    }
    setStep((prev) => Math.min(4, prev + 1));
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await createCustomerRequest(
        {
          eventName,
          eventType,
          eventDate,
          location,
          guestCount,
          requiredServices,
          budget,
          specialInstructions
        },
        currentUser
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-10 max-w-3xl mx-auto w-full">
      {/* Top Header Card */}
      <div className="rounded-3xl bg-white border border-[#EAE5DE] shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DE]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#242424]">Create Event</h1>
            <p className="text-xs text-[#736B66] mt-0.5">
              Fill in your event specifications to receive custom manager quotes.
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

        {/* 4-Step Indicator matching reference mockup bottom-left */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs select-none">
          {[
            { num: 1, label: 'Details' },
            { num: 2, label: 'Requirements' },
            { num: 3, label: 'Budget' },
            { num: 4, label: 'Review' }
          ].map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div
                key={s.num}
                onClick={() => { if (step > s.num) setStep(s.num); }}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
                  isCurrent
                    ? 'border-[#4B0718] bg-[#FFF8F3] text-[#4B0718] font-bold shadow-xs'
                    : isCompleted
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold cursor-pointer'
                    : 'border-[#EAE5DE] text-[#736B66] bg-[#F8F7F5]'
                }`}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#4B0718] text-white">
                  {s.num}
                </span>
                <span className="text-[11px] font-medium hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: EVENT DETAILS */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#242424] mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Birthday Celebration, Tech Meetup, Wedding"
                className="w-full bg-[#F8F7F5] border border-[#EAE5DE] rounded-xl py-2.5 px-3.5 text-xs text-[#242424] focus:outline-none focus:border-[#4B0718]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#242424] mb-1.5">
                Event Type *
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-[#F8F7F5] border border-[#EAE5DE] rounded-xl py-2.5 px-3.5 text-xs text-[#242424] focus:outline-none focus:border-[#4B0718]"
              >
                <option value="Wedding">Wedding</option>
                <option value="Birthday">Birthday Celebration</option>
                <option value="Corporate Event">Corporate Event</option>
                <option value="College Fest">College Fest</option>
                <option value="Exhibition">Exhibition / Expo</option>
                <option value="Social Gathering">Social Gathering</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#242424] mb-1.5">
                  Event Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-[#736B66]" />
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#F8F7F5] border border-[#EAE5DE] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#242424] focus:outline-none focus:border-[#4B0718]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#242424] mb-1.5">
                  Location / City *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#736B66]" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bangalore, Palace Grounds"
                    className="w-full bg-[#F8F7F5] border border-[#EAE5DE] rounded-xl py-2.5 pl-9 pr-3 text-xs text-[#242424] focus:outline-none focus:border-[#4B0718]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: REQUIREMENTS */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#242424] mb-1.5">
                Estimated Guest Count
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="20"
                  max="1500"
                  step="20"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="flex-1 accent-[#4B0718]"
                />
                <span className="w-20 text-center font-bold text-xs bg-[#FFF8F3] border border-[#EAE5DE] py-2 px-3 rounded-xl text-[#4B0718]">
                  {guestCount} guests
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#242424] mb-2">
                Required Services (Select all that apply) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {serviceOptions.map((srv) => {
                  const isChecked = requiredServices.includes(srv);
                  return (
                    <button
                      type="button"
                      key={srv}
                      onClick={() => toggleService(srv)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition cursor-pointer ${
                        isChecked
                          ? 'border-[#4B0718] bg-[#FFF8F3] text-[#4B0718] shadow-xs'
                          : 'border-[#EAE5DE] bg-[#F8F7F5] text-[#736B66] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="leading-tight">{srv}</span>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-[#4B0718] shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: BUDGET & NOTES */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#242424] mb-1.5">
                Estimated Total Budget (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[#736B66]">₹</span>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  placeholder="250000"
                  className="w-full bg-[#F8F7F5] border border-[#EAE5DE] rounded-xl py-2.5 pl-8 pr-3 text-xs text-[#242424] focus:outline-none focus:border-[#4B0718] font-bold"
                />
              </div>
              <p className="text-[11px] text-[#736B66] mt-1">
                Managers will customize their quotes around this budget range.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#242424] mb-1.5">
                Special Requests or Theme Details (Optional)
              </label>
              <textarea
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Mention decor color preferences, catering cuisine (South Indian / Continental), sound requirements, etc."
                className="w-full bg-[#F8F7F5] border border-[#EAE5DE] rounded-xl p-3 text-xs text-[#242424] focus:outline-none focus:border-[#4B0718]"
              />
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-[#EAE5DE] space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DE]">
                <span className="text-[#736B66]">Event Title</span>
                <span className="font-bold text-[#242424]">{eventName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DE]">
                <span className="text-[#736B66]">Category & Type</span>
                <span className="font-bold text-[#242424]">{eventType}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DE]">
                <span className="text-[#736B66]">Date & Location</span>
                <span className="font-bold text-[#242424]">{eventDate} · {location}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DE]">
                <span className="text-[#736B66]">Guest Count</span>
                <span className="font-bold text-[#242424]">{guestCount} Guests</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE5DE]">
                <span className="text-[#736B66]">Target Budget</span>
                <span className="font-bold text-[#4B0718]">₹{Number(budget).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#736B66] block mb-1">Services:</span>
                <div className="flex flex-wrap gap-1.5">
                  {requiredServices.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full bg-white border border-[#EAE5DE] text-[10px] font-bold text-[#4B0718]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Controls Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#EAE5DE]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              className="py-2.5 px-4 rounded-xl border border-[#EAE5DE] text-xs font-bold text-[#736B66] hover:bg-[#F8F7F5] flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="py-2.5 px-5 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="py-2.5 px-6 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold shadow-md shadow-[#4B0718]/20 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Submit Event Request</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
