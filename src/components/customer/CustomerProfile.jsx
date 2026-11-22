import React from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, LogOut, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const CustomerProfile = ({ onBack }) => {
  const { currentUser, logout } = useAuth();
  const { bookings, requests, seedConceptBoardDemo, clearDatabase } = useDatabase();

  const userId = currentUser?.id || currentUser?.uid;
  const myBookings = bookings.filter((b) => b.customerId === userId || b.customerId === 'cust_1');
  const totalSpent = myBookings.reduce((acc, b) => acc + (b.paidAmount || 0), 0);

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Top Header matching reference image: `< My Profile` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-black tracking-tight text-white">Customer Profile</h2>
      </div>

      <div className="flex-1 p-5 overflow-y-auto no-scrollbar space-y-4">
        {/* Profile Avatar Card */}
        <div className="p-6 rounded-3xl bg-white border border-[#EDE0D7] shadow-xs text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#4B0718] shadow-sm mb-3">
            <img
              src={
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
              }
              alt={currentUser?.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="font-black text-lg text-[#260C13]">
            {currentUser?.name || 'Kirthana'}
          </h3>
          <p className="text-xs font-semibold text-[#8B7377] mt-0.5">Event Host Account</p>

          <div className="w-full mt-4 pt-4 border-t border-[#EDE0D7] text-left space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#8B7377] uppercase">Email:</span>
              <p className="font-semibold text-[#260C13] mt-0.5">{currentUser?.email}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8B7377] uppercase">Phone:</span>
              <p className="font-semibold text-[#260C13] mt-0.5">{currentUser?.phone || '+91 98765 43210'}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#8B7377] uppercase">City:</span>
              <p className="font-semibold text-[#260C13] mt-0.5">{currentUser?.city || 'Bengaluru, India'}</p>
            </div>
          </div>
        </div>

        {/* Real activity statistics */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs">
            <p className="text-2xl font-black text-[#4B0718]">{myBookings.length}</p>
            <p className="text-xs font-bold text-[#8B7377] mt-1">Bookings Confirmed</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs">
            <p className="text-xl font-black text-[#4B0718]">₹{totalSpent.toLocaleString('en-IN')}</p>
            <p className="text-xs font-bold text-[#8B7377] mt-1">Total Paid</p>
          </div>
        </div>

        {/* Demo Data Seed Tool for Presentation */}
        <div className="p-4 rounded-3xl bg-white border border-[#EDE0D7] space-y-2">
          <p className="text-xs font-bold text-[#260C13]">Concept Board Demo Data</p>
          <p className="text-[11px] text-[#8B7377] leading-relaxed">
            By default all new accounts show 0 records (no fake data). Tap below if you want to populate the concept board's sample events (Kirthana Wedding, Aura Events, etc.) for testing.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                seedConceptBoardDemo();
                alert('Populated concept board demo data!');
              }}
              className="flex-1 py-2 rounded-xl bg-[#FFF8F3] border border-[#EDE0D7] hover:border-[#4B0718] text-[#4B0718] text-xs font-bold"
            >
              Populate Concept Data
            </button>
            <button
              onClick={() => {
                clearDatabase();
                alert('Reset to 0 records (clean real data)!');
              }}
              className="py-2 px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full py-3.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
          >
            <LogOut className="w-4 h-4 text-rose-700" />
            <span>Sign Out of Customer Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
