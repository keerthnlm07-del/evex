import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Signal, BatteryMedium, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileFrame = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('9:41');
  const [deviceMode, setDeviceMode] = useState('phone'); // 'phone' | 'fluid'
  const { currentUser, selectedRole, logout } = useAuth();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRoleTheme = () => {
    switch (selectedRole || currentUser?.role) {
      case 'customer':
        return { label: 'Customer Portal', color: 'text-[#4B0718] bg-[#FFF8F3] border-[#EDE0D7]' };
      case 'manager':
        return { label: 'Event Manager Portal', color: 'text-[#4B0718] bg-[#FFF8F3] border-[#EDE0D7]' };
      case 'seeker':
        return { label: 'Job Seeker Portal', color: 'text-[#4B0718] bg-[#FFF8F3] border-[#EDE0D7]' };
      default:
        return { label: 'Portal Selection', color: 'text-[#8B7377] bg-white border-[#EDE0D7]' };
    }
  };

  const roleTheme = getRoleTheme();

  return (
    <div className="min-h-screen bg-[#2A050E] text-[#260C13] flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Desktop Controls Bar (Hidden on small touchscreens) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-3 px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            EVEX Android App
          </span>
          <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${roleTheme.color}`}>
            {roleTheme.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentUser && (
            <button
              onClick={logout}
              title="Sign Out to switch role"
              className="flex items-center gap-1 text-[11px] text-amber-100 hover:text-white bg-white/10 px-2 py-1 rounded-lg border border-white/20 transition active:scale-95"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          )}

          <button
            onClick={() => setDeviceMode(deviceMode === 'phone' ? 'fluid' : 'phone')}
            className="flex items-center gap-1 text-amber-100 hover:text-white bg-white/10 px-2 py-1 rounded-lg border border-white/20 transition active:scale-95"
            title="Toggle Device Frame"
          >
            {deviceMode === 'phone' ? (
              <>
                <Monitor className="w-3 h-3" />
                <span className="text-[11px]">Fluid</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3" />
                <span className="text-[11px]">Phone</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Device Viewport */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          deviceMode === 'phone'
            ? 'max-w-[414px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] sm:rounded-[44px] sm:border-[8px] sm:border-[#350713] sm:shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden'
            : 'max-w-[480px] min-h-[100dvh] sm:rounded-3xl sm:border sm:border-[#4B0718]/40 shadow-2xl overflow-hidden'
        } bg-[#FFF8F3]`}
      >
        {/* Android Top Status Bar */}
        <div className="w-full bg-[#4B0718] pt-2 pb-1.5 px-6 flex items-center justify-between text-xs text-white/90 select-none shrink-0 z-50">
          <span className="font-semibold text-[13px] tracking-tight">{currentTime}</span>

          {/* Android Center Camera Punch-hole */}
          <div className="w-3.5 h-3.5 rounded-full bg-black/60 border border-black/40 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-1.5 text-white/90">
            <Signal className="w-3.5 h-3.5 text-white" />
            <Wifi className="w-3.5 h-3.5 text-white" />
            <BatteryMedium className="w-4 h-4 text-white rotate-90" />
          </div>
        </div>

        {/* Mobile Viewport Screen Content */}
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar relative bg-[#FFF8F3]">
          {children}
        </div>

        {/* Android Gesture Navigation Bar Pill */}
        <div className="w-full bg-white py-1.5 flex justify-center items-center shrink-0 z-50 border-t border-[#EDE0D7]/40">
          <div className="w-28 h-1 rounded-full bg-[#260C13]/30" />
        </div>
      </div>
    </div>
  );
};
