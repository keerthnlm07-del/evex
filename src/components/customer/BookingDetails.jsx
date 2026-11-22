import React, { useState } from 'react';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

export const BookingDetails = ({ booking, onBack, onPayBalance, onOpenChat }) => {
  if (!booking) return null;

  const milestones = [
    { title: 'Request Submitted', date: '10 Oct 2026', done: true },
    { title: 'Proposal Accepted', date: '12 Oct 2026', done: true },
    { title: 'Advance Paid ✔', date: '13 Oct 2026', done: true },
    { title: 'In Preparation (Current)', date: 'Ongoing', current: true },
    { title: 'Event Day', date: booking.eventDate || '15 Dec 2026', upcoming: true },
    { title: 'Completed', date: 'Post-event', upcoming: true }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Header matching reference: `< Booking Details` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        <button
          onClick={onBack}
          className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-black tracking-tight text-white">Booking Details</h2>
      </div>

      <div className="flex-1 p-5 overflow-y-auto no-scrollbar space-y-4">
        {/* Event Header Banner matching reference image */}
        <div className="w-full rounded-3xl overflow-hidden bg-white border border-[#EDE0D7] shadow-xs">
          <img
            src={booking.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'}
            alt={booking.eventName}
            className="w-full h-44 object-cover"
          />

          <div className="p-4 flex items-center justify-between border-b border-[#EDE0D7]">
            <div>
              <h3 className="font-black text-base text-[#260C13]">{booking.eventName}</h3>
              <p className="text-xs font-medium text-[#8B7377]">{booking.managerName}</p>
            </div>

            {/* Phone & Chat icons matching reference */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Calling ${booking.managerName} at +91 99887 76655`)}
                className="w-9 h-9 rounded-full bg-[#FFF8F3] border border-[#EDE0D7] text-[#4B0718] flex items-center justify-center hover:bg-[#4B0718] hover:text-white transition"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenChat ? onOpenChat() : alert(`Opening chat with ${booking.managerName}`)}
                className="w-9 h-9 rounded-full bg-[#FFF8F3] border border-[#EDE0D7] text-[#4B0718] flex items-center justify-center hover:bg-[#4B0718] hover:text-white transition"
                title="Message Manager"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 grid grid-cols-2 gap-2 text-xs text-[#260C13] bg-[#FFF8F3]">
            <div>
              <span className="text-[10px] text-[#8B7377]">Event Date:</span>
              <p className="font-bold">{booking.eventDate}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#8B7377]">Location:</span>
              <p className="font-bold truncate">{booking.location}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#8B7377]">Total Budget:</span>
              <p className="font-bold text-[#4B0718]">₹{Number(booking.totalAmount).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <span className="text-[10px] text-[#8B7377]">Paid Advance:</span>
              <p className="font-bold text-emerald-700">₹{Number(booking.paidAmount || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Vertical Timeline Tracking matching reference */}
        <div className="p-5 rounded-3xl bg-white border border-[#EDE0D7] shadow-xs">
          <h4 className="text-xs font-bold text-[#260C13] uppercase tracking-wider mb-4">
            Booking Tracking Timeline
          </h4>

          <div className="space-y-4 pl-2 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EDE0D7]">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex items-start gap-3 relative z-10">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${
                    m.done
                      ? 'bg-[#4B0718] border-[#4B0718] text-white'
                      : m.current
                      ? 'bg-amber-500 border-white text-white ring-2 ring-amber-500'
                      : 'bg-white border-[#EDE0D7] text-transparent'
                  }`}
                >
                  {m.done && <span className="text-[10px] font-bold">✓</span>}
                  {m.current && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-bold leading-tight ${
                      m.current ? 'text-[#4B0718] font-black' : m.done ? 'text-[#260C13]' : 'text-[#8B7377]'
                    }`}
                  >
                    {m.title}
                  </p>
                  <p className="text-[10px] text-[#8B7377] mt-0.5">{m.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Make Payment button if remaining amount exists */}
        {booking.remainingAmount > 0 && (
          <button
            onClick={() => onPayBalance?.(booking)}
            className="w-full py-4 rounded-2xl bg-[#4B0718] hover:bg-[#350713] text-white font-bold text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Remaining Balance (₹{booking.remainingAmount?.toLocaleString('en-IN')})</span>
          </button>
        )}
      </div>
    </div>
  );
};
