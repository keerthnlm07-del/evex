import React, { useState } from 'react';
import {
  Users2,
  Briefcase,
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  Star,
  CheckCircle2,
  XCircle,
  Check,
  X,
  Phone,
  ShieldCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { StatusBadge } from '../common/StatusBadge';
import { PostJobModal } from './PostJobModal';

export const ManagerRecruitment = () => {
  const { currentUser } = useAuth();
  const { jobListings, applications, updateApplicationStatus } = useDatabase();

  const [activeTab, setActiveTab] = useState('postings'); // 'postings' | 'applications'
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [viewingApplicant, setViewingApplicant] = useState(null);

  // Filter for this manager
  const myJobs = jobListings.filter((j) => j.managerId === currentUser?.id);
  const myJobIds = myJobs.map((j) => j.id);
  const myApplications = applications.filter((a) => myJobIds.includes(a.jobId));
  const pendingApps = myApplications.filter((a) => a.status === 'applied' || a.status === 'under_review');

  const handleAcceptApplicant = (app) => {
    updateApplicationStatus(
      app.id,
      'accepted',
      `Confirmed by ${currentUser?.name}. Reporting instructions dispatched.`
    );
    setViewingApplicant(null);
  };

  const handleRejectApplicant = (app) => {
    updateApplicationStatus(app.id, 'rejected', 'Position filled or candidate profile mismatch.');
    setViewingApplicant(null);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-6 space-y-4 overflow-y-auto no-scrollbar">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Recruitment Hub</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Post gig openings & manage on-demand event workforce
          </p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-600/30 transition active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Job</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="p-1 rounded-2xl bg-[#12192D] border border-slate-800 flex">
        <button
          onClick={() => {
            setActiveTab('postings');
            setSelectedJobForApplicants(null);
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'postings'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Active Postings</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-amber-300 font-extrabold">
            {myJobs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
            activeTab === 'applications'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Applicants</span>
          {pendingApps.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-extrabold">
              {pendingApps.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: JOB POSTINGS */}
      {activeTab === 'postings' && (
        <div className="space-y-3.5">
          {myJobs.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#12192D] border border-dashed border-slate-800 text-center">
              <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-300">No Job Listings Posted</p>
              <p className="text-xs text-slate-500 mt-1">
                Post hospitality, catering, or decor crew requirements for your upcoming events.
              </p>
              <button
                onClick={() => setShowPostModal(true)}
                className="mt-3 px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold"
              >
                Create First Opening
              </button>
            </div>
          ) : (
            myJobs.map((job) => {
              const jobApps = myApplications.filter((a) => a.jobId === job.id);
              const filledPercentage = Math.round(
                ((job.workersFilled || 0) / (job.workersRequired || 1)) * 100
              );

              return (
                <div
                  key={job.id}
                  className="rounded-3xl bg-[#12192D] border border-slate-800/80 p-4 space-y-3 shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-amber-400">
                        {job.eventType}
                      </span>
                      <h3 className="font-extrabold text-sm text-white mt-0.5">{job.jobTitle}</h3>
                      <p className="text-xs text-slate-400">
                        ₹{job.salaryAmount} / {job.paymentType}
                      </p>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>

                  {/* Date & Location */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 p-2.5 rounded-2xl bg-[#0F1527] border border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{job.eventDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>
                        {job.startTime} - {job.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span className="truncate text-slate-400">{job.location}</span>
                    </div>
                  </div>

                  {/* Crew Fill Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Recruitment Progress:</span>
                      <span className="font-bold text-white">
                        {job.workersFilled || 0} of {job.workersRequired} Filled ({filledPercentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                        style={{ width: `${Math.min(100, filledPercentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills?.map((sk, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-md"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  {/* Action to view applicants for this job */}
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {jobApps.length} applicant{jobApps.length === 1 ? '' : 's'} registered
                    </span>
                    <button
                      onClick={() => {
                        setSelectedJobForApplicants(job.id);
                        setActiveTab('applications');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold flex items-center gap-1 transition"
                    >
                      <span>Review Crew ({jobApps.length})</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: MANAGE APPLICANTS */}
      {activeTab === 'applications' && (
        <div className="space-y-3.5">
          {selectedJobForApplicants && (
            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/40 flex items-center justify-between text-xs text-amber-300">
              <span>Filtered by selected job</span>
              <button
                onClick={() => setSelectedJobForApplicants(null)}
                className="text-[11px] underline font-bold"
              >
                Show All Applicants
              </button>
            </div>
          )}

          {myApplications.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#12192D] border border-dashed border-slate-800 text-center">
              <Users2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-300">No Applicants Yet</p>
              <p className="text-xs text-slate-500 mt-1">
                When job seekers apply for your event gigs, their profiles will appear here for review.
              </p>
            </div>
          ) : (
            myApplications
              .filter((a) => !selectedJobForApplicants || a.jobId === selectedJobForApplicants)
              .map((app) => (
                <div
                  key={app.id}
                  className="rounded-3xl bg-[#12192D] border border-slate-800/80 p-4 space-y-3 shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.applicantAvatar}
                        alt={app.applicantName}
                        className="w-11 h-11 rounded-2xl object-cover border border-amber-500/40"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-white">{app.applicantName}</h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <p className="text-xs text-amber-400 font-semibold">{app.jobTitle}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-slate-200">{app.applicantRating || 4.9}</span>
                          <span>• {app.applicantPhone}</span>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {app.applicantSkills?.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#0F1527] border border-slate-800 text-slate-300 px-2 py-0.5 rounded-lg"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Experience Brief */}
                  {app.applicantExperience && (
                    <p className="text-xs text-slate-300 italic bg-slate-900/60 p-2 rounded-xl">
                      “{app.applicantExperience}”
                    </p>
                  )}

                  {/* Action Buttons: Accept / Reject / View Profile */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => setViewingApplicant(app)}
                      className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                    >
                      View Profile
                    </button>

                    {app.status !== 'accepted' && (
                      <button
                        onClick={() => handleAcceptApplicant(app)}
                        className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition active:scale-95 shadow-md shadow-emerald-600/30"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Crew</span>
                      </button>
                    )}

                    {app.status !== 'rejected' && app.status !== 'accepted' && (
                      <button
                        onClick={() => handleRejectApplicant(app)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* APPLICANT PROFILE DETAILS MODAL */}
      {viewingApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#10172A] border border-amber-900/50 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white text-base">Worker Profile & Credentials</h3>
              <button
                onClick={() => setViewingApplicant(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={viewingApplicant.applicantAvatar}
                alt={viewingApplicant.applicantName}
                className="w-14 h-14 rounded-2xl object-cover border border-amber-500"
              />
              <div>
                <h4 className="font-extrabold text-white text-base">
                  {viewingApplicant.applicantName}
                </h4>
                <p className="text-xs text-amber-400 font-semibold">{viewingApplicant.jobTitle}</p>
                <p className="text-[11px] text-slate-400">{viewingApplicant.applicantPhone}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-[#141C35] border border-slate-800 space-y-1.5">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Skills</p>
                <p className="font-semibold text-slate-200">
                  {viewingApplicant.applicantSkills?.join(', ')}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-bold pt-1">Experience</p>
                <p className="text-slate-300">{viewingApplicant.applicantExperience}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleRejectApplicant(viewingApplicant)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 text-rose-400 text-xs font-bold"
              >
                Decline
              </button>
              <button
                onClick={() => handleAcceptApplicant(viewingApplicant)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-emerald-600/30"
              >
                <Check className="w-4 h-4" />
                <span>Confirm & Hire for Gig</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      <PostJobModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSuccess={() => setActiveTab('postings')}
      />
    </div>
  );
};
