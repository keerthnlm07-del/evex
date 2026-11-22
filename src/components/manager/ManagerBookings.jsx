import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const ManagerBookings = ({ onBack, onSelectBooking }) => {
  const { currentUser } = useAuth();
  const { bookings } = useDatabase();
  const [activeTab, setActiveTab] = useState('confirmed');

  const userId = currentUser?.id || currentUser?.uid;
  const myBookings = bookings.filter((b) => b.managerId === userId || b.managerId === 'mgr_aura');

  const tabs = [
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' }
  ];

  const filteredBookings = myBookings.filter((b) => {
    if (activeTab === 'confirmed') return b.status === 'confirmed';
    if (activeTab === 'ongoing') return b.status === 'ongoing' || b.status === 'confirmed';
    if (activeTab === 'completed') return b.status === 'completed';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Top Header matching reference image: `< My Bookings` */}
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

      {/* Tabs matching reference: Confirmed | Ongoing | Completed */}
      <div className="p-3 bg-white border-b border-[#EDE0D7] flex items-center justify-between gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition text-center ${
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

      {/* Bookings List matching reference image */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-dashed border-[#EDE0D7] text-center my-auto">
            <Calendar className="w-10 h-10 text-[#8B7377] mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-[#260C13]">No Events in this Category</h4>
            <p className="text-xs text-[#8B7377] mt-1">
              Events booked by clients will be displayed with execution progress bars.
            </p>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              onClick={() => onSelectBooking?.(b)}
              className="p-3.5 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs flex gap-3.5 items-center cursor-pointer hover:border-[#4B0718]/40 transition"
            >
              <img
                src={b.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'}
                alt={b.eventName}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-sm text-[#260C13] truncate">
                  {b.eventName} - {b.customerName || 'Kirthana'}
                </h4>
                <p className="text-xs font-medium text-[#8B7377] mt-0.5">{b.eventDate}</p>

                {/* Progress Bar matching reference: Progress: Preparation (50%) */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#4B0718] mb-1">
                    <span>Progress: Preparation ({b.progressPercent || 50}%)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#FFF8F3] overflow-hidden border border-[#EDE0D7]">
                    <div
                      className="h-full bg-[#4B0718] rounded-full"
                      style={{ width: `${b.progressPercent || 50}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
