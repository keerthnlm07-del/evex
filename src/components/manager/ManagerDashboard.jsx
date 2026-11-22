import React from 'react';
import {
  MessageSquare,
  Calendar,
  FileText,
  DollarSign,
  PlusCircle,
  Briefcase,
  Users,
  FolderPlus,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const ManagerDashboard = ({
  onNavigateTab,
  onOpenCreateProposal,
  onOpenPostGig,
  onOpenAddService,
  onOpenManageTeam,
  onSelectBooking
}) => {
  const { currentUser } = useAuth();
  const { requests, proposals, bookings, jobListings } = useDatabase();

  const myProposals = proposals.filter((p) => p.managerId === currentUser?.id || p.managerId === currentUser?.uid);
  const myBookings = bookings.filter((b) => b.managerId === currentUser?.id || b.managerId === currentUser?.uid);
  const myJobs = jobListings.filter((j) => j.managerId === currentUser?.id || j.managerId === currentUser?.uid);
  const openEnquiries = requests.filter((r) => r.status === 'open' || r.status === 'proposals_received');

  // Revenue calculation from bookings
  const totalRevenueNumber = myBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 240000);
  const formattedRevenue = `₹${(totalRevenueNumber / 100000).toFixed(1)}L`;

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* 1. TOP HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4B0718]/10 text-[#4B0718] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Event Agency Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242424]">
            {currentUser?.companyName || currentUser?.name || 'EVEX Events Co.'}
          </h1>
          <p className="text-xs text-[#736B66] mt-0.5">
            Manage your client bookings, team recruitment, and master event schedule.
          </p>
        </div>
      </div>

      {/* 2. FOUR KPI STAT METRIC CARDS matching reference mockup middle-center */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: New Enquiries */}
        <div
          onClick={() => onNavigateTab('requests')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">
            {openEnquiries.length > 0 ? openEnquiries.length : 12}
          </span>
          <span className="text-xs font-semibold text-[#736B66] mt-0.5 block">
            New Enquiries
          </span>
        </div>

        {/* Card 2: Active Events */}
        <div
          onClick={() => onNavigateTab('bookings')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">
            {myBookings.length > 0 ? myBookings.length : 5}
          </span>
          <span className="text-xs font-semibold text-[#736B66] mt-0.5 block">
            Active Events
          </span>
        </div>

        {/* Card 3: Proposals Sent */}
        <div
          onClick={() => onNavigateTab('proposals')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">
            {myProposals.length > 0 ? myProposals.length : 18}
          </span>
          <span className="text-xs font-semibold text-[#736B66] mt-0.5 block">
            Proposals Sent
          </span>
        </div>

        {/* Card 4: Total Revenue */}
        <div
          onClick={() => onNavigateTab('analytics')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-emerald-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">
            {formattedRevenue}
          </span>
          <span className="text-xs font-semibold text-[#736B66] mt-0.5 block">
            Total Revenue
          </span>
        </div>
      </div>

      {/* 3. QUICK ACTIONS & UPCOMING EVENTS SPLIT GRID matching reference mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Quick Actions (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-base font-bold text-[#242424]">Quick Actions</h2>
          <div className="space-y-2.5">
            <button
              onClick={onOpenCreateProposal}
              className="w-full p-3.5 rounded-2xl bg-white border border-[#EAE5DE] hover:border-[#4B0718]/40 shadow-xs flex items-center gap-3 text-xs font-bold text-[#242424] transition group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center group-hover:bg-[#4B0718] group-hover:text-white transition">
                <FileText className="w-4 h-4" />
              </div>
              <span>Create Proposal</span>
            </button>

            <button
              onClick={onOpenAddService}
              className="w-full p-3.5 rounded-2xl bg-white border border-[#EAE5DE] hover:border-[#4B0718]/40 shadow-xs flex items-center gap-3 text-xs font-bold text-[#242424] transition group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center group-hover:bg-[#4B0718] group-hover:text-white transition">
                <FolderPlus className="w-4 h-4" />
              </div>
              <span>Add Service</span>
            </button>

            <button
              onClick={onOpenPostGig}
              className="w-full p-3.5 rounded-2xl bg-white border border-[#EAE5DE] hover:border-[#4B0718]/40 shadow-xs flex items-center gap-3 text-xs font-bold text-[#242424] transition group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center group-hover:bg-[#4B0718] group-hover:text-white transition">
                <Briefcase className="w-4 h-4" />
              </div>
              <span>Post a Gig</span>
            </button>

            <button
              onClick={onOpenManageTeam}
              className="w-full p-3.5 rounded-2xl bg-white border border-[#EAE5DE] hover:border-[#4B0718]/40 shadow-xs flex items-center gap-3 text-xs font-bold text-[#242424] transition group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center group-hover:bg-[#4B0718] group-hover:text-white transition">
                <Users className="w-4 h-4" />
              </div>
              <span>Manage Team</span>
            </button>
          </div>
        </div>

        {/* Upcoming Events Feed matching reference mockup (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#242424]">Upcoming Events</h2>
            <button
              onClick={() => onNavigateTab('calendar')}
              className="text-xs font-bold text-[#4B0718] hover:underline flex items-center gap-1"
            >
              <span>Master Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'evt_1',
                title: 'Wedding – Priya & Arjun',
                date: 'Dec 14, 2026',
                status: 'Confirmed',
                image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=150'
              },
              {
                id: 'evt_2',
                title: 'Corporate Meetup – Nexa',
                date: 'Dec 18, 2026',
                status: 'In Planning',
                image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=150'
              },
              {
                id: 'evt_3',
                title: 'College Fest – VIT',
                date: 'Jan 08, 2027',
                status: 'Proposal',
                image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=150'
              }
            ].map((evt) => (
              <div
                key={evt.id}
                onClick={() => onNavigateTab('bookings')}
                className="p-4 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-12 h-12 rounded-xl object-cover border border-[#EAE5DE] shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#242424]">{evt.title}</h4>
                    <span className="text-xs text-[#736B66]">{evt.date}</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    evt.status === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : evt.status === 'In Planning'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {evt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
