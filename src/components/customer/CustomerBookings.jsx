import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Heart, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const CustomerBookings = ({ onBack, onSelectBooking, defaultTab = 'all' }) => {
  const { currentUser } = useAuth();
  const { bookings } = useDatabase();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [favorites, setFavorites] = useState(['My Wedding']);

  const userId = currentUser?.id || currentUser?.uid;
  const myBookings = bookings.filter((b) => b.customerId === userId);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' }
  ];

  const filteredBookings = myBookings.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return b.status === 'confirmed';
    if (activeTab === 'ongoing') return b.status === 'ongoing' || b.status === 'confirmed';
    if (activeTab === 'completed') return b.status === 'completed';
    return true;
  });

  const toggleFav = (name, e) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Header matching reference: `< My Bookings` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-black tracking-tight text-white">My Bookings</h2>
      </div>

      {/* Segmented Filter Tabs matching reference: All | Upcoming | Ongoing | Completed */}
      <div className="p-3 bg-white border-b border-[#EDE0D7] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition ${
                isActive
                  ? 'bg-[#4B0718] text-white shadow-xs'
                  : 'bg-[#FFF8F3] text-[#8B7377] hover:text-[#260C13]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Booking Cards List matching reference */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-dashed border-[#EDE0D7] text-center my-auto">
            <Calendar className="w-10 h-10 text-[#8B7377] mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-[#260C13]">No Bookings Found</h4>
            <p className="text-xs text-[#8B7377] mt-1">
              Confirmed bookings and timelines will appear here.
            </p>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const isFav = favorites.includes(b.eventName);
            return (
              <div
                key={b.id}
                onClick={() => onSelectBooking?.(b)}
                className="p-3.5 rounded-2xl bg-white border border-[#EDE0D7] hover:border-[#4B0718]/40 shadow-xs transition flex gap-3.5 cursor-pointer relative"
              >
                <img
                  src={b.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'}
                  alt={b.eventName}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0 pr-6">
                  <h4 className="font-extrabold text-sm text-[#260C13] truncate">{b.eventName}</h4>
                  <p className="text-xs font-medium text-[#8B7377] mt-0.5">{b.managerName}</p>
                  <p className="text-[11px] text-[#8B7377] mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#4B0718]" />
                    <span>{b.eventDate} · {b.location}</span>
                  </p>

                  <div className="mt-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      Status: {b.status === 'confirmed' ? 'Confirmed' : 'Preparation'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => toggleFav(b.eventName, e)}
                  className="absolute top-3.5 right-3.5 text-[#8B7377] hover:text-[#4B0718]"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
