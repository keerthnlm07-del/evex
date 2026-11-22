import React from 'react';
import { Sparkles, Calendar, Briefcase, Users, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const HowItWorksPage = ({ onPlanEvent, onExploreServices, onFindJobs }) => {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-10">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4B0718]/10 text-[#4B0718] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Workflow Overview</span>
        </div>
        <h1 className="text-3xl font-bold text-[#242424]">How EVEX Works</h1>
        <p className="text-sm text-[#736B66] mt-1">
          A seamless ecosystem connecting Event Clients, Agencies, and Gig Professionals.
        </p>
      </div>

      {/* 3 User Journeys */}
      <div className="space-y-6">
        {/* Customer Journey */}
        <div className="p-6 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-[#242424]">For Event Clients</h3>
              <p className="text-xs text-[#736B66]">Plan your celebration effortlessly</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#736B66]">
            <div className="p-4 rounded-xl bg-[#F8F7F5] border border-[#EAE5DE]">
              <p className="font-bold text-[#242424] mb-1">1. Submit Requirements</p>
              <p>Specify date, location, guest count, and needed services in a 4-step wizard.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8F7F5] border border-[#EAE5DE]">
              <p className="font-bold text-[#242424] mb-1">2. Compare Proposals</p>
              <p>Verified event managers send itemized quotes and portfolios to your inbox.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8F7F5] border border-[#EAE5DE]">
              <p className="font-bold text-[#242424] mb-1">3. Confirmed Booking</p>
              <p>Accept proposal with initial advance escrow simulation and track execution.</p>
            </div>
          </div>
          <button
            onClick={onPlanEvent}
            className="mt-4 py-2 px-4 rounded-xl bg-[#4B0718] text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <span>Plan an Event</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Manager Journey */}
        <div className="p-6 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-[#242424]">For Event Managers & Agencies</h3>
              <p className="text-xs text-[#736B66]">Grow your bookings and coordinate your team</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#736B66]">
            <div className="p-4 rounded-xl bg-[#F8F7F5] border border-[#EAE5DE]">
              <p className="font-bold text-[#242424] mb-1">1. Review Enquiries</p>
              <p>Access high-intent client inquiries and submit transparent custom proposals.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8F7F5] border border-[#EAE5DE]">
              <p className="font-bold text-[#242424] mb-1">2. Recruit Workforce</p>
              <p>Post open gig shifts for banquet stewards, audio crew, and setup assistants.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8F7F5] border border-[#EAE5DE]">
              <p className="font-bold text-[#242424] mb-1">3. Manage & Analyze</p>
              <p>Use master calendar, track expenses, and view revenue analytics in real-time.</p>
            </div>
          </div>
          <button
            onClick={onExploreServices}
            className="mt-4 py-2 px-4 rounded-xl bg-white border border-[#EAE5DE] text-[#242424] text-xs font-bold inline-flex items-center gap-1.5 hover:bg-[#F8F7F5]"
          >
            <span>Explore Agency Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Talent Journey */}
        <div className="p-6 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-[#242424]">For Event Talent & Gig Workers</h3>
              <p className="text-xs text-[#736B66]">Find flexible event shifts and get paid</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#736B66]">
            <div className="p-4 rounded-xl bg-[#F8F7F5] border border-[#EAE5DE]">
              <p className="font-bold text-[#242424] mb-1">1. Browse Local Gigs</p>
              <p>Filter event jobs by role, date, daily rate, and location.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8F7F5] border border-[#EAE5DE]">
              <p className="font-bold text-[#242424] mb-1">2. Instant Application</p>
              <p>Apply with your verified profile, skills, and past event experience.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8F7F5] border border-[#EAE5DE]">
              <p className="font-bold text-[#242424] mb-1">3. Guaranteed Payouts</p>
              <p>Complete shifts, receive manager ratings, and track earnings transparently.</p>
            </div>
          </div>
          <button
            onClick={onFindJobs}
            className="mt-4 py-2 px-4 rounded-xl bg-[#4B0718] text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <span>Find Event Gigs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
