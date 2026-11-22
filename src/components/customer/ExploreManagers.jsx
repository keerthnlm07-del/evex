import React, { useState } from 'react';
import { ArrowLeft, Search, Star, Heart, ShieldCheck, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const ExploreManagers = ({ onBack, onSelectManager, initialFavoritesOnly = false }) => {
  const { users } = useAuth();
  const { savedManagers, toggleSaveManager } = useDatabase();
  const [search, setSearch] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(initialFavoritesOnly);

  const registeredManagers = users.filter((u) => u.role === 'manager');

  const baseManagers = [
    {
      id: 'mgr_aura',
      name: 'Aura Events Co.',
      rating: '4.8 (120)',
      specialties: 'Weddings · Corporate · Social',
      verified: true,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=150'
    },
    {
      id: 'mgr_elite',
      name: 'Elite Celebrations',
      rating: '4.6 (90)',
      specialties: 'Weddings · Birthdays · Exhibitions',
      verified: true,
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=150'
    },
    {
      id: 'mgr_celeb',
      name: 'Eventique Studio',
      rating: '4.7 (65)',
      specialties: 'Weddings · Anniversaries · Galas',
      verified: true,
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=150'
    }
  ];

  const allManagers = [
    ...baseManagers,
    ...registeredManagers
      .filter((m) => !baseManagers.some((b) => b.name.toLowerCase() === m.name.toLowerCase()))
      .map((m) => ({
        id: m.id || m.uid,
        name: m.name || m.companyName,
        rating: '5.0 (New)',
        specialties: (m.specialties || ['Weddings', 'Corporate']).join(' · '),
        verified: true,
        image: m.avatar || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=150'
      }))
  ];

  const filtered = allManagers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.specialties.toLowerCase().includes(search.toLowerCase());
    const matchesFav = filterFavorites ? savedManagers.includes(m.id) || savedManagers.includes(m.name) : true;
    return matchesSearch && matchesFav;
  });

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DE]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#242424]">
            {filterFavorites ? 'Saved Event Managers' : 'Explore Event Managers'}
          </h1>
          <p className="text-xs text-[#736B66] mt-0.5">
            Discover verified agencies, view client ratings, and request event proposals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              filterFavorites
                ? 'bg-[#4B0718] text-white border-[#4B0718]'
                : 'bg-white border-[#EAE5DE] text-[#736B66] hover:text-[#242424]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filterFavorites ? 'fill-white' : ''}`} />
            <span>Saved Only</span>
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl text-[#736B66] hover:bg-[#F8F7F5] border border-[#EAE5DE]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#736B66]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by agency name, event specialties..."
          className="w-full bg-white border border-[#EAE5DE] rounded-xl py-2.5 pl-10 pr-4 text-xs text-[#242424] placeholder-[#736B66] focus:outline-none focus:border-[#4B0718] shadow-xs"
        />
      </div>

      {/* Manager Cards List */}
      <div className="space-y-3">
        {filtered.map((mgr) => {
          const isSaved = savedManagers.includes(mgr.id) || savedManagers.includes(mgr.name);
          return (
            <div
              key={mgr.id}
              onClick={() => onSelectManager?.(mgr)}
              className="p-5 rounded-2xl bg-white border border-[#EAE5DE] hover:border-[#4B0718]/40 shadow-xs hover:shadow-sm transition flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <img
                  src={mgr.image}
                  alt={mgr.name}
                  className="w-14 h-14 rounded-full object-cover border border-[#EAE5DE] shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#242424] group-hover:text-[#4B0718] transition">
                      {mgr.name}
                    </h3>
                    {mgr.verified && (
                      <ShieldCheck className="w-4 h-4 text-[#4B0718]" title="Verified Agency" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#736B66]">
                    <div className="flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{mgr.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{mgr.specialties}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveManager(mgr.id);
                  }}
                  className={`p-2 rounded-xl border transition ${
                    isSaved
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-[#EAE5DE] text-[#736B66] hover:bg-[#F8F7F5]'
                  }`}
                  title={isSaved ? 'Remove from saved' : 'Save manager'}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : ''}`} />
                </button>

                <div className="w-8 h-8 rounded-full bg-[#FFF8F3] border border-[#EAE5DE] flex items-center justify-center text-[#4B0718] group-hover:bg-[#4B0718] group-hover:text-white transition">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-xs text-[#736B66] bg-white rounded-2xl border border-[#EAE5DE]">
            No managers found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};
