import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Star,
  CheckCircle2,
  Clock,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const JobDetails = ({ job, onBack, onApplySuccess }) => {
  const { currentUser } = useAuth();
  const { applyForJob, applications } = useDatabase();
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!job) return null;

  const hasApplied = applications.some(
    (a) => a.jobId === job.id && (a.applicantId === currentUser?.id || a.applicantId === currentUser?.uid)
  );

  const handleApplyNow = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        applyForJob(job, currentUser);
        setApplied(true);
        setTimeout(() => {
          onApplySuccess?.();
        }, 800);
      } catch (err) {
        alert(err.message || 'Already applied.');
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Header matching reference: `< Job Details` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        <button
          onClick={onBack}
          className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-black tracking-tight text-white">Job Details</h2>
      </div>

      <div className="flex-1 p-5 overflow-y-auto no-scrollbar space-y-4">
        {/* Top Banner Image matching reference */}
        <div className="w-full h-44 rounded-3xl overflow-hidden bg-white border border-[#EDE0D7] shadow-xs">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800"
            alt="Event Stage"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title & Agency Info matching reference */}
        <div className="p-4 rounded-3xl bg-white border border-[#EDE0D7] shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-black text-lg text-[#260C13]">{job.jobTitle}</h3>
              <p className="text-xs font-semibold text-[#8B7377] mt-0.5">{job.eventName}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>4.8</span>
            </div>
          </div>

          {/* 4 Detail Badges matching reference */}
          <div className="grid grid-cols-2 gap-2 text-xs text-[#260C13] pt-2 border-t border-[#EDE0D7]">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF8F3] border border-[#EDE0D7]">
              <Calendar className="w-4 h-4 text-[#4B0718]" />
              <span className="font-bold">{job.date || '15 Dec 2026'}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF8F3] border border-[#EDE0D7]">
              <MapPin className="w-4 h-4 text-[#4B0718]" />
              <span className="font-bold truncate">{job.location || 'Bengaluru'}</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF8F3] border border-[#EDE0D7]">
              <Users className="w-4 h-4 text-[#4B0718]" />
              <span className="font-bold">{job.workersRequired || 10} Vacancies</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FFF8F3] border border-[#EDE0D7]">
              <IndianRupee className="w-4 h-4 text-[#4B0718]" />
              <span className="font-bold text-[#4B0718]">₹{job.salaryPerDay} / day</span>
            </div>
          </div>
        </div>

        {/* Description & Responsibilities */}
        <div className="p-4 rounded-3xl bg-white border border-[#EDE0D7] shadow-xs space-y-2 text-xs">
          <h4 className="font-bold text-[#260C13] uppercase tracking-wider text-[11px]">
            Job Description & Requirements
          </h4>
          <p className="text-[#8B7377] leading-relaxed">
            {job.jobDescription ||
              'Assist the head banquet manager with hospitality, buffet circulation, guest refreshments, and post-event turnaround.'}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {(job.requiredSkills || ['Catering', 'Setup', 'Service']).map((sk) => (
              <span
                key={sk}
                className="text-[10px] font-bold bg-[#FFF8F3] text-[#4B0718] px-2.5 py-1 rounded-lg border border-[#EDE0D7]"
              >
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Burgundy Apply Now button matching reference */}
        <div className="pt-2">
          {hasApplied || applied ? (
            <div className="w-full py-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Application Submitted Successfully</span>
            </div>
          ) : (
            <button
              onClick={handleApplyNow}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#4B0718] hover:bg-[#350713] active:scale-98 text-white font-bold text-base shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Submitting Application...' : 'Apply Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
