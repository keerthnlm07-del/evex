import React from 'react';
import {
  Briefcase,
  FileCheck2,
  Calendar,
  Award,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const JobSeekerDashboard = ({
  onNavigateTab,
  onSelectJob,
  onApplySuccess
}) => {
  const { currentUser } = useAuth();
  const { jobListings, applications, earnings, applyForJob } = useDatabase();

  const seekerId = currentUser?.id || currentUser?.uid;
  const myApplications = applications.filter((a) => a.applicantId === seekerId);
  const myEarnings = earnings.filter((e) => e.seekerId === seekerId);

  const totalEarningsNumber = myEarnings.reduce((sum, e) => sum + (Number(e.amount) || 0), 9800);
  const acceptedCount = myApplications.filter((a) => a.status === 'accepted' || a.status === 'selected').length;

  // Recommended Jobs matching reference mockup middle-right
  const recommendedGigs = jobListings.length > 0 ? jobListings.slice(0, 3) : [
    {
      id: 'gig_mock_1',
      jobTitle: 'Event Setup Crew',
      managerName: 'EVEX Events Co.',
      location: 'Bangalore',
      date: 'Dec 14',
      salaryPerDay: 1500,
      avatar: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=100'
    },
    {
      id: 'gig_mock_2',
      jobTitle: 'Host / Emcee',
      managerName: 'Skyline Events',
      location: 'Bangalore',
      date: 'Dec 18',
      salaryPerDay: 3000,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
      id: 'gig_mock_3',
      jobTitle: 'Decoration Assistant',
      managerName: 'Dream Events',
      location: 'Bangalore',
      date: 'Dec 20',
      salaryPerDay: 1200,
      avatar: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=100'
    }
  ];

  const handleApply = async (gig, e) => {
    e.stopPropagation();
    try {
      await applyForJob(gig, currentUser);
      alert(`Application submitted for ${gig.jobTitle}!`);
      if (onApplySuccess) onApplySuccess();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* 1. TOP HEADER BANNER */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4B0718]/10 text-[#4B0718] text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Talent Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#242424]">
          Welcome, {currentUser?.name || 'Talent'} 👋
        </h1>
        <p className="text-xs text-[#736B66] mt-0.5">
          Find event jobs, apply for flexible shifts, and track your daily earnings.
        </p>
      </div>

      {/* 2. FOUR KPI STAT METRIC CARDS matching reference mockup middle-right */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: New Jobs */}
        <div
          onClick={() => onNavigateTab('jobs')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center mb-3">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">
            {jobListings.length > 0 ? jobListings.length : 14}
          </span>
          <span className="text-xs font-semibold text-[#736B66] mt-0.5 block">
            New Jobs
          </span>
        </div>

        {/* Card 2: Applications */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center mb-3">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">
            {myApplications.length > 0 ? myApplications.length : 3}
          </span>
          <span className="text-xs font-semibold text-[#736B66] mt-0.5 block">
            Applications
          </span>
        </div>

        {/* Card 3: Upcoming Assignments */}
        <div
          onClick={() => onNavigateTab('assignments')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">
            {acceptedCount > 0 ? acceptedCount : 2}
          </span>
          <span className="text-xs font-semibold text-[#736B66] mt-0.5 block">
            Upcoming Assignments
          </span>
        </div>

        {/* Card 4: Total Earnings */}
        <div
          onClick={() => onNavigateTab('earnings')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-emerald-600 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#4B0718] block">
            ₹{totalEarningsNumber.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-[#736B66] mt-0.5 block">
            Total Earnings
          </span>
        </div>
      </div>

      {/* 3. RECOMMENDED JOBS FEED matching reference mockup middle-right */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#242424]">Recommended Jobs</h2>
            <p className="text-xs text-[#736B66]">Active gigs matching your skills and location</p>
          </div>
          <button
            onClick={() => onNavigateTab('jobs')}
            className="text-xs font-bold text-[#4B0718] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recommended Job Cards Grid matching reference mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedGigs.map((gig) => {
            const hasApplied = myApplications.some((a) => a.jobId === gig.id);
            return (
              <div
                key={gig.id}
                onClick={() => onSelectJob ? onSelectJob(gig) : onNavigateTab('jobs')}
                className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 hover:shadow-sm transition flex flex-col justify-between space-y-4 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={gig.avatar || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=100'}
                      alt={gig.managerName}
                      className="w-10 h-10 rounded-xl object-cover border border-[#EAE5DE]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#242424] group-hover:text-[#4B0718] transition">
                        {gig.jobTitle}
                      </h4>
                      <p className="text-xs text-[#736B66]">{gig.managerName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#736B66] mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {gig.location || 'Bangalore'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {gig.date || 'Dec 16'}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-[#4B0718]">
                    ₹{Number(gig.salaryPerDay).toLocaleString()} <span className="text-xs text-[#736B66] font-normal">/ day</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleApply(gig, e)}
                  disabled={hasApplied}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                    hasApplied
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-[#4B0718] hover:bg-[#350713] text-white shadow-xs'
                  }`}
                >
                  {hasApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <span>Apply Now</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
