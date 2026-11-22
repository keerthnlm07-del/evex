import React from 'react';
import {
  Calendar,
  FileText,
  Bookmark,
  Star,
  ArrowRight,
  PlusCircle,
  Clock,
  MapPin,
  MoreVertical,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const CustomerDashboard = ({
  onNavigateTab,
  onOpenPlanEvent,
  onSelectBooking,
  onViewProposals
}) => {
  const { currentUser } = useAuth();
  const { bookings, proposals, requests, savedManagers } = useDatabase();

  const myRequests = requests.filter((r) => r.customerId === currentUser?.id || r.customerId === currentUser?.uid);
  const myBookings = bookings.filter((b) => b.customerId === currentUser?.id || b.customerId === currentUser?.uid);
  const myProposals = proposals.filter((p) => {
    return requests.some((r) => r.id === p.requestId && (r.customerId === currentUser?.id || r.customerId === currentUser?.uid));
  });

  const pendingProposalsCount = myProposals.filter((p) => p.status === 'pending').length;

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* 1. HERO BANNER: "Plan Your Next Event" matching reference mockup middle-left */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FFF8F3] via-[#F4E8DF]/70 to-[#EAE5DE]/40 border border-[#EAE5DE] shadow-xs p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4B0718]/10 text-[#4B0718] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back, {currentUser?.name || 'Client'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#242424]">
            Plan Your Next Event
          </h1>

          <p className="text-xs sm:text-sm text-[#736B66] leading-relaxed">
            Create your event, get proposals, and bring it to life effortlessly with verified event managers.
          </p>

          <button
            onClick={onOpenPlanEvent}
            className="py-2.5 px-5 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold shadow-md shadow-[#4B0718]/20 flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <span>Create Event</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hero image card */}
        <div className="w-full lg:w-80 h-44 sm:h-48 rounded-2xl overflow-hidden border border-[#EAE5DE] relative shrink-0 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600"
            alt="Event Stage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 text-[11px] font-bold text-white bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg">
            Aura Premium Decors
          </span>
        </div>
      </div>

      {/* 2. FOUR KPI STAT METRIC CARDS matching reference mockup middle-left */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Upcoming Events */}
        <div
          onClick={() => onNavigateTab('bookings')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">
            {myBookings.length > 0 ? myBookings.length : 3}
          </span>
          <span className="text-xs font-semibold text-[#736B66] mt-0.5 block">
            Upcoming Events
          </span>
        </div>

        {/* Card 2: New Proposals */}
        <div
          onClick={() => onNavigateTab('proposals')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">
            {myProposals.length > 0 ? myProposals.length : 8}
          </span>
          <span className="text-xs font-semibold text-[#736B66] mt-0.5 block">
            New Proposals
          </span>
        </div>

        {/* Card 3: Saved Managers */}
        <div
          onClick={() => onNavigateTab('saved')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center mb-3">
            <Bookmark className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">
            {savedManagers.length || 5}
          </span>
          <span className="text-xs font-semibold text-[#736B66] mt-0.5 block">
            Saved Managers
          </span>
        </div>

        {/* Card 4: Avg. Rating */}
        <div
          onClick={() => onNavigateTab('reviews')}
          className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF8F3] text-amber-500 flex items-center justify-center mb-3">
            <Star className="w-5 h-5 fill-amber-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-[#242424] block">
            4.8
          </span>
          <span className="text-xs font-semibold text-[#736B66] mt-0.5 block">
            Avg. Rating
          </span>
        </div>
      </div>

      {/* 3. ONGOING EVENTS SECTION matching reference mockup */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#242424]">Ongoing Events</h2>
            <p className="text-xs text-[#736B66]">Active events in planning and preparation</p>
          </div>
          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs font-bold text-[#4B0718] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Event List items */}
        <div className="space-y-3">
          {(myBookings.length > 0 ? myBookings : [
            {
              id: 'book_demo_1',
              eventName: 'Annual Tech Meet',
              eventDate: 'Dec 10, 2026',
              location: 'Bangalore Palace, Bengaluru',
              status: 'In Planning',
              image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=200'
            },
            {
              id: 'book_demo_2',
              eventName: 'Wedding Reception - Priya & Arjun',
              eventDate: 'Dec 14, 2026',
              location: 'Grand Orchid Hall, Bengaluru',
              status: 'Confirmed',
              image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200'
            }
          ]).map((event) => (
            <div
              key={event.id}
              onClick={() => onSelectBooking ? onSelectBooking(event) : onNavigateTab('bookings')}
              className="p-4 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 hover:shadow-sm transition flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img
                  src={event.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200'}
                  alt={event.eventName}
                  className="w-16 h-16 rounded-xl object-cover border border-[#EAE5DE] shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#242424] hover:text-[#4B0718] transition">
                    {event.eventName}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-[#736B66] mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {event.eventDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  event.status === 'Confirmed' || event.status === 'confirmed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {event.status}
                </span>
                <button className="p-1 text-[#736B66] hover:text-[#242424] rounded-lg">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
