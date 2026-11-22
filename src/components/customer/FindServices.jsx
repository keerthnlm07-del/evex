import React, { useState } from 'react';
import {
  Search,
  Star,
  ShieldCheck,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PlanEventModal } from './PlanEventModal';

export const FindServices = ({ onSelectTab }) => {
  const { users } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [targetCompany, setTargetCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filter event managers from users list
  const managers = users.filter((u) => u.role === 'manager');

  const categories = ['All', 'Luxury Weddings', 'Corporate Galas', 'Themed Birthdays', 'Catering & Decor'];

  const filteredManagers = managers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.city?.toLowerCase().includes(search.toLowerCase()) ||
      m.specialties?.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    if (selectedCategory === 'All') return matchesSearch;
    return matchesSearch && m.specialties?.some((s) => s.toLowerCase().includes(selectedCategory.toLowerCase()));
  });

  const handleRequestQuote = (manager) => {
    setTargetCompany(manager.name);
    setShowModal(true);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-6 space-y-4 overflow-y-auto no-scrollbar">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-white">Find Event Services</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Connect with top-rated event management companies & design studios
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company name, city, or specialty..."
          className="w-full bg-[#12192D] border border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedCategory === cat
                ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                : 'bg-[#12192D] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Managers List */}
      <div className="space-y-4">
        {filteredManagers.map((manager) => (
          <div
            key={manager.id}
            className="rounded-3xl bg-[#12192D] border border-slate-800/80 overflow-hidden shadow-xl"
          >
            {/* Cover Image banner */}
            <div className="h-32 w-full relative">
              <img
                src={
                  manager.coverImage ||
                  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80'
                }
                alt={manager.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12192D] via-transparent to-black/30" />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-300 flex items-center gap-1 border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{manager.rating || 4.9}</span>
                <span className="text-[10px] text-slate-400">({manager.reviewsCount || 100}+)</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 pt-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-base text-white">{manager.name}</h3>
                    {manager.verified && (
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" title="EVEX Verified" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {manager.city || 'Pan-India Operations'} • {manager.experienceYears || 5}+ Yrs Exp
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                {manager.about ||
                  'Specializing in premium event design, stage lighting, catering management and vetted gig staffing.'}
              </p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1.5">
                {(manager.specialties || ['Weddings', 'Decor', 'Catering']).map((sp) => (
                  <span
                    key={sp}
                    className="text-[10px] font-semibold bg-purple-950/40 border border-purple-800/40 text-purple-300 px-2 py-0.5 rounded-lg"
                  >
                    {sp}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Custom proposals within 2-4 hrs
                </span>
                <button
                  onClick={() => handleRequestQuote(manager)}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-purple-600/30"
                >
                  <span>Request Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Event Modal */}
      <PlanEventModal
        isOpen={showModal}
        prefilledCompany={targetCompany}
        onClose={() => {
          setShowModal(false);
          setTargetCompany(null);
        }}
        onSuccess={() => onSelectTab('bookings')}
      />
    </div>
  );
};
