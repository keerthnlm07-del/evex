import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Briefcase,
  Users,
  Compass,
  Star,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  Award,
  ChevronRight
} from 'lucide-react';

export const LandingPage = ({
  onOpenAuth,
  onExploreServices,
  onPlanEvent,
  onFindJobs,
  onNavigateTab
}) => {
  const categories = [
    {
      id: 'weddings',
      title: 'Weddings',
      description: 'Royal celebrations, intimate ceremonies, and reception management.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80',
      badge: 'Popular'
    },
    {
      id: 'corporate',
      title: 'Corporate Events',
      description: 'Summits, conferences, award galas, and executive retreats.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
      badge: 'Professional'
    },
    {
      id: 'birthdays',
      title: 'Birthdays & Private',
      description: 'Theme parties, milestones, anniversaries, and family banquets.',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&auto=format&fit=crop&q=80',
      badge: 'Social'
    },
    {
      id: 'college',
      title: 'College Fests',
      description: 'Cultural festivals, concert productions, and sports meets.',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&auto=format&fit=crop&q=80',
      badge: 'Youth'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8F7F5] text-[#242424]">
      {/* 1. HERO SECTION matching reference mockup top-left */}
      <section className="relative px-4 sm:px-6 lg:px-12 pt-8 pb-14 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFF8F3] via-[#F4E8DF]/60 to-[#EAE5DE]/40 border border-[#EAE5DE] shadow-xs p-6 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headlines & Call to Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4B0718]/10 border border-[#4B0718]/20 text-[#4B0718] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>EVENTS · PEOPLE · OPPORTUNITIES</span>
              </div>

              <h1 className="font-['Cinzel',serif] text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#242424] leading-[1.15]">
                Plan. Hire. <span className="text-[#4B0718]">Celebrate.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#736B66] leading-relaxed max-w-xl">
                A smart platform that connects event planners, clients, and event talent — all in one place.
                Experience seamless quotes, transparent proposals, and verified talent booking.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onPlanEvent}
                  className="py-3 px-6 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#4B0718]/20 flex items-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <span>Plan an Event</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onExploreServices}
                  className="py-3 px-6 rounded-xl bg-white hover:bg-[#F8F7F5] border border-[#EAE5DE] text-[#242424] text-xs sm:text-sm font-bold shadow-xs transition active:scale-95 cursor-pointer"
                >
                  Explore Services
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#736B66]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#4B0718]" />
                  <span>Verified Agencies</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>4.8/5 Avg Rating</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Zero Booking Fees</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floral Stage Visual matching reference image */}
            <div className="lg:col-span-5 relative">
              <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden shadow-lg border border-[#EAE5DE] relative">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80"
                  alt="Elegant Wedding Stage"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                    Featured Event Production
                  </span>
                  <p className="text-sm font-bold">Royal Orchid Palace · Bengaluru</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE PILLARS matching reference mockup */}
      <section className="px-4 sm:px-6 lg:px-12 py-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Plan Events */}
          <div
            onClick={onPlanEvent}
            className="p-6 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center mb-4 group-hover:bg-[#4B0718] group-hover:text-white transition">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#242424] mb-1">Plan Events</h3>
            <p className="text-xs text-[#736B66] leading-relaxed">
              From initial ideas to execution. Submit event requirements and receive competitive quotes from top agencies.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#4B0718]">
              <span>Get Quotes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: Hire Professionals */}
          <div
            onClick={onExploreServices}
            className="p-6 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center mb-4 group-hover:bg-[#4B0718] group-hover:text-white transition">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#242424] mb-1">Hire Professionals</h3>
            <p className="text-xs text-[#736B66] leading-relaxed">
              Find trusted event managers, catering coordinators, sound specialists, and decorators with verified portfolios.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#4B0718]">
              <span>Browse Managers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Find Gig Opportunities */}
          <div
            onClick={onFindJobs}
            className="p-6 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 hover:shadow-md transition cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FFF8F3] text-[#4B0718] flex items-center justify-center mb-4 group-hover:bg-[#4B0718] group-hover:text-white transition">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#242424] mb-1">Find Gig Opportunities</h3>
            <p className="text-xs text-[#736B66] leading-relaxed">
              Event jobs for creatives, banquet staff, photographers, and on-site coordinators with guaranteed per-day payouts.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#4B0718]">
              <span>Explore Gigs</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. EVENT CATEGORIES SHOWCASE */}
      <section className="px-4 sm:px-6 lg:px-12 py-10 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#242424]">Explore Event Categories</h2>
            <p className="text-xs text-[#736B66] mt-0.5">Specialized services for every milestone and gathering</p>
          </div>
          <button
            onClick={onExploreServices}
            className="text-xs font-bold text-[#4B0718] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={onExploreServices}
              className="rounded-2xl bg-white border border-[#EAE5DE] overflow-hidden shadow-xs hover:shadow-md transition group cursor-pointer"
            >
              <div className="h-40 relative overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-[#4B0718] text-white px-2 py-0.5 rounded-full">
                  {cat.badge}
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-[#242424] group-hover:text-[#4B0718] transition">
                  {cat.title}
                </h4>
                <p className="text-xs text-[#736B66] mt-1 line-clamp-2">
                  {cat.description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs font-bold text-[#4B0718]">
                  <span>Explore</span>
                  <div className="w-6 h-6 rounded-full bg-[#FFF8F3] flex items-center justify-center group-hover:bg-[#4B0718] group-hover:text-white transition">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="mt-auto border-t border-[#EAE5DE] bg-white px-4 sm:px-6 lg:px-12 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#736B66]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4B0718]" />
            <span className="font-['Cinzel',serif] font-bold text-sm text-[#4B0718]">EVEX</span>
            <span className="text-[#EAE5DE]">|</span>
            <span>© 2026 EVEX Platform. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={() => onNavigateTab('explore-services')} className="hover:text-[#4B0718] transition">
              Services
            </button>
            <button onClick={() => onNavigateTab('find-jobs')} className="hover:text-[#4B0718] transition">
              Gig Opportunities
            </button>
            <button onClick={() => onNavigateTab('how-it-works')} className="hover:text-[#4B0718] transition">
              How It Works
            </button>
            <button onClick={() => onNavigateTab('about')} className="hover:text-[#4B0718] transition">
              About
            </button>
            <button onClick={() => onNavigateTab('privacy')} className="hover:text-[#4B0718] transition">
              Privacy Policy
            </button>
            <button onClick={() => onNavigateTab('terms')} className="hover:text-[#4B0718] transition">
              Terms
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
