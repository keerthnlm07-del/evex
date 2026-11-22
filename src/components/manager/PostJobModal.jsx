import React, { useState } from 'react';
import {
  X,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';

export const PostJobModal = ({ isOpen, onClose, onSuccess }) => {
  const { createJobListing } = useDatabase();
  const { currentUser } = useAuth();

  const [jobTitle, setJobTitle] = useState('Wedding Helpers');
  const [eventType, setEventType] = useState('Wedding');
  const [jobDescription, setJobDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('Guest Hospitality, Banquet Support');
  const [workersRequired, setWorkersRequired] = useState('5');
  const [salaryAmount, setSalaryAmount] = useState('2000');
  const [paymentType, setPaymentType] = useState('Daily');
  const [location, setLocation] = useState('Taj Lands End, Bandra, Mumbai');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('04:00 PM');
  const [endTime, setEndTime] = useState('11:30 PM');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const jobRoles = [
    'Wedding Helpers',
    'Catering Staff',
    'Photographers',
    'Decorators',
    'Event Coordinators',
    'Security Staff',
    'Sound & AV Engineers'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!jobTitle || !eventDate || !location || !salaryAmount) {
      alert('Please fill in required job fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      createJobListing(
        {
          jobTitle,
          eventType,
          jobDescription:
            jobDescription.trim() ||
            `Looking for dependable ${jobTitle} to assist on-site operations for our upcoming ${eventType}.`,
          requiredSkills: requiredSkills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          workersRequired: Number(workersRequired) || 1,
          salaryAmount: Number(salaryAmount),
          paymentType,
          location: location.trim(),
          eventDate,
          startTime,
          endTime,
          mealProvided: true,
          transportAllowance: true
        },
        currentUser
      );

      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onSuccess?.();
        onClose();
      }, 1000);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-lg bg-[#0E1528] border border-amber-900/40 rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#141B30]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Post Event Gig Opening</h3>
              <p className="text-[11px] text-slate-400">Recruit verified on-demand gig crew</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">Gig Opening Published!</h4>
            <p className="text-xs text-slate-400 mt-1">
              Active job seekers on EVEX have been notified and can apply immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
            {/* Job Title Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Position / Role <span className="text-rose-400">*</span>
              </label>
              <select
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-[#141C35] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {jobRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Type & Openings */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Type</label>
                <input
                  type="text"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  placeholder="Wedding, Gala, Concert"
                  className="w-full bg-[#141C35] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Crew Openings <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={workersRequired}
                  onChange={(e) => setWorkersRequired(e.target.value)}
                  className="w-full bg-[#141C35] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Pay Amount & Pay Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Amount (₹) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="number"
                    required
                    value={salaryAmount}
                    onChange={(e) => setSalaryAmount(e.target.value)}
                    placeholder="2000"
                    className="w-full bg-[#141C35] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Frequency</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full bg-[#141C35] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Daily">Daily Payout</option>
                  <option value="Hourly">Hourly Rate</option>
                  <option value="Fixed">Fixed Gig Settlement</option>
                </select>
              </div>
            </div>

            {/* Event Date & Location */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Event Date <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-[#141C35] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Venue</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Venue or Landmark"
                  className="w-full bg-[#141C35] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Timings */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Start Time</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="04:00 PM"
                  className="w-full bg-[#141C35] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">End Time</label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="11:30 PM"
                  className="w-full bg-[#141C35] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Required Skills (comma separated)
              </label>
              <input
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                placeholder="Banquet Service, Tray Balancing, Guest Ushering"
                className="w-full bg-[#141C35] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Job Responsibilities & Brief
              </label>
              <textarea
                rows={2}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Brief the crew on dress code, banquet expectations, or gear requirements..."
                className="w-full bg-[#141C35] border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 pb-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition active:scale-98 disabled:opacity-50"
              >
                {loading ? 'Posting to EVEX Job Board...' : 'Publish Job Listing'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
