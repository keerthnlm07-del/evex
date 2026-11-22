import React from 'react';
import { X, Bell, CheckCircle2, Clock, Calendar, Briefcase, IndianRupee } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const { notifications } = useDatabase();
  const { currentUser } = useAuth();

  if (!isOpen) return null;

  // Filter notifications for current user's role or user specific
  const list = notifications || [];
  const roleNotifs = list.filter((n) => {
    if (!currentUser) return true;
    if (n.userId && n.userId === currentUser.id) return true;
    if (n.role && n.role === currentUser.role) return true;
    return false;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-sm h-full bg-[#0D1322] border-l border-purple-900/30 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Notifications</h3>
              <p className="text-[11px] text-slate-400">Activity updates for your account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {roleNotifs.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Bell className="w-10 h-10 text-slate-600 mb-2 stroke-[1.5]" />
              <p className="font-medium text-sm text-slate-300">No new notifications</p>
              <p className="text-xs text-slate-500 mt-1">You are all caught up with event updates and gigs.</p>
            </div>
          ) : (
            roleNotifs.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#141B2E] border border-slate-800/60 hover:border-purple-500/30 transition flex gap-3"
              >
                <div className="mt-0.5">
                  <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    {item.title.includes('Proposal') ? (
                      <Calendar className="w-3.5 h-3.5" />
                    ) : item.title.includes('Gig') || item.title.includes('Applicant') ? (
                      <Briefcase className="w-3.5 h-3.5" />
                    ) : item.title.includes('Payment') ? (
                      <IndianRupee className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">{item.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
