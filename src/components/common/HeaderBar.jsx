import React, { useState } from 'react';
import { Bell, Sparkles, RotateCcw, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { NotificationDrawer } from './NotificationDrawer';

export const HeaderBar = () => {
  const { currentUser, selectedRole, logout } = useAuth();
  const { notifications, resetDatabase } = useDatabase();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => {
    if (!currentUser) return false;
    return (n.userId === currentUser.id || n.role === currentUser.role) && !n.read;
  }).length;

  const getRoleBadge = () => {
    switch (selectedRole || currentUser?.role) {
      case 'customer':
        return { label: 'Customer', color: 'from-purple-500 to-indigo-600' };
      case 'manager':
        return { label: 'Event Manager', color: 'from-amber-500 to-orange-600' };
      case 'seeker':
        return { label: 'Job Seeker', color: 'from-emerald-500 to-teal-600' };
      default:
        return { label: 'Guest', color: 'from-slate-500 to-slate-700' };
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0A0F1D]/90 backdrop-blur-md border-b border-purple-950/40 px-4 py-2.5 flex items-center justify-between">
        {/* EVEX Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-white">EVEX</span>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider text-white px-1.5 py-0.5 rounded-full bg-gradient-to-r ${roleInfo.color}`}
              >
                {roleInfo.label}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Events & Workforce Hub</p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5">
          {/* Quick Database Reset for Demo */}
          <button
            onClick={() => setShowConfirmReset(true)}
            title="Reset Mock Data"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(true)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition relative active:scale-95"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            )}
          </button>

          {/* Sign Out Button (Strict Role Isolation Demonstration) */}
          <button
            onClick={logout}
            title="Sign Out to Role Selection"
            className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition active:scale-95 flex items-center gap-1 text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Notifications Drawer */}
      <NotificationDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

      {/* Confirm Reset Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#10162A] border border-purple-900/50 rounded-2xl p-5 max-w-xs w-full shadow-2xl text-center">
            <div className="w-10 h-10 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Reset Demo Data?</h4>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              This will restore all default bookings, job postings, customer requests, and proposals back to clean sample data.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDatabase();
                  setShowConfirmReset(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/40"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
