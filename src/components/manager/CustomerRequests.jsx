import React from 'react';
import { ArrowLeft, Inbox, Calendar, MapPin, IndianRupee } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

export const CustomerRequests = ({ onBack, onSelectRequest }) => {
  const { requests } = useDatabase();

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Top Header matching reference image: `< Event Requests` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-black tracking-tight text-white">Event Requests</h2>
      </div>

      {/* Requests List matching reference layout */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3">
        {requests.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-dashed border-[#EDE0D7] text-center my-auto">
            <Inbox className="w-10 h-10 text-[#8B7377] mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-[#260C13]">No Requests Available</h4>
            <p className="text-xs text-[#8B7377] mt-1">
              Customer inquiries and target budgets will be shown here in real time.
            </p>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs flex items-center justify-between"
            >
              <div>
                <h3 className="font-extrabold text-sm text-[#260C13]">{req.eventName}</h3>
                <p className="text-xs font-black text-[#4B0718] mt-0.5">
                  Budget: ₹{Number(req.budget).toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-[#8B7377] mt-0.5">
                  {req.eventDate} · {req.location}
                </p>
              </div>

              {/* Burgundy View Button matching reference */}
              <button
                onClick={() => onSelectRequest?.(req)}
                className="py-1.5 px-4 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold transition active:scale-95 shadow-xs"
              >
                View
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
