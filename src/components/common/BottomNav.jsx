import React from 'react';
import {
  Home,
  CalendarCheck,
  Compass,
  User,
  Inbox,
  Briefcase,
  Calendar,
  MessageSquare,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const BottomNav = ({ activeTab, onSelectTab }) => {
  const { currentUser } = useAuth();
  const { proposals, requests, applications } = useDatabase();

  const role = currentUser?.role;

  // Unread badge counters
  const pendingCustomerProposals = proposals.filter((p) => p.status === 'pending').length;
  const pendingManagerRequests = requests.filter((r) => r.status === 'open').length;

  const getNavItems = () => {
    switch (role) {
      case 'customer':
        return [
          { id: 'home', label: 'Home', icon: Home },
          {
            id: 'bookings',
            label: 'Events',
            icon: CalendarCheck,
            badge: pendingCustomerProposals > 0 ? pendingCustomerProposals : null
          },
          { id: 'explore', label: 'Explore', icon: Compass },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'profile', label: 'Profile', icon: User }
        ];

      case 'manager':
        return [
          { id: 'home', label: 'Home', icon: Home },
          {
            id: 'requests',
            label: 'Enquiries',
            icon: Inbox,
            badge: pendingManagerRequests > 0 ? pendingManagerRequests : null
          },
          { id: 'bookings', label: 'Events', icon: CalendarCheck },
          { id: 'calendar', label: 'Calendar', icon: Calendar },
          { id: 'profile', label: 'Profile', icon: User }
        ];

      case 'seeker':
        return [
          { id: 'home', label: 'Home', icon: Home },
          { id: 'jobs', label: 'Gigs', icon: Briefcase },
          { id: 'applications', label: 'Applied', icon: CalendarCheck },
          { id: 'earnings', label: 'Earnings', icon: Award },
          { id: 'profile', label: 'Profile', icon: User }
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();
  if (navItems.length === 0) return null;

  return (
    <nav className="lg:hidden sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE5DE] px-3 py-2 flex items-center justify-around shadow-sm select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl relative transition-all duration-150 active:scale-95 ${
              isActive
                ? 'text-[#4B0718] font-bold'
                : 'text-[#736B66] hover:text-[#242424] font-medium'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'stroke-[2.4] scale-105 text-[#4B0718]' : 'stroke-[1.8]'
                }`}
              />
              {item.badge && (
                <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-[#4B0718] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                  {item.badge}
                </span>
              )}
            </div>

            <span className="text-[10px] mt-1 tracking-tight leading-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
