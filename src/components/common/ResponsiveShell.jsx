import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Bell,
  LogOut,
  Calendar,
  Compass,
  FileText,
  MessageSquare,
  Bookmark,
  Star,
  User,
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  TrendingUp,
  Award,
  CheckCircle2,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { NotificationDrawer } from './NotificationDrawer';

export const ResponsiveShell = ({
  activeTab,
  onSelectTab,
  children,
  onOpenAuth,
  onNavigateHome
}) => {
  const { currentUser, logout } = useAuth();
  const { notifications } = useDatabase();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const role = currentUser?.role;

  // Sidebar items mapped according to reference mockup
  const getNavItems = () => {
    if (!currentUser) {
      return [
        { id: 'landing', label: 'Home', icon: LayoutDashboard },
        { id: 'explore-services', label: 'Explore Services', icon: Compass },
        { id: 'find-jobs', label: 'Event Jobs', icon: Briefcase },
        { id: 'how-it-works', label: 'How It Works', icon: CheckCircle2 },
        { id: 'about', label: 'About EVEX', icon: Sparkles }
      ];
    }

    if (role === 'customer') {
      return [
        { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'plan-event', label: 'Plan Event', icon: PlusCircle },
        { id: 'explore', label: 'Explore Managers', icon: Compass },
        { id: 'bookings', label: 'My Events', icon: Calendar },
        { id: 'proposals', label: 'Proposals', icon: FileText, badge: '8' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '2' },
        { id: 'saved', label: 'Saved Managers', icon: Bookmark },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'profile', label: 'Profile', icon: User }
      ];
    }

    if (role === 'manager') {
      return [
        { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'requests', label: 'Enquiries', icon: MessageSquare, badge: '12' },
        { id: 'proposals', label: 'Proposals', icon: FileText, badge: '18' },
        { id: 'bookings', label: 'Events', icon: Calendar, badge: '5' },
        { id: 'calendar', label: 'Calendar', icon: Calendar },
        { id: 'services', label: 'Services', icon: FolderOpen },
        { id: 'recruitment', label: 'Gigs & Hiring', icon: Briefcase },
        { id: 'team', label: 'Team', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'profile', label: 'Profile', icon: User }
      ];
    }

    // Job Seeker
    return [
      { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'jobs', label: 'Find Jobs', icon: Briefcase, badge: '14' },
      { id: 'applications', label: 'My Applications', icon: FileText, badge: '3' },
      { id: 'saved', label: 'Saved Jobs', icon: Bookmark },
      { id: 'assignments', label: 'Assignments', icon: Calendar, badge: '2' },
      { id: 'earnings', label: 'Earnings', icon: Award },
      { id: 'reviews', label: 'Reviews', icon: Star },
      { id: 'profile', label: 'Profile', icon: User }
    ];
  };

  const navItems = getNavItems();

  const getRoleLabel = () => {
    if (role === 'customer') return 'Client Portal';
    if (role === 'manager') return 'Event Agency';
    if (role === 'seeker') return 'Talent Partner';
    return 'Guest';
  };

  return (
    <div className="min-h-screen bg-[#F8F7F5] text-[#242424] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* =================================================================== */}
      {/* DESKTOP & TABLET LAYOUT (>= 1024px)                                 */}
      {/* =================================================================== */}
      <div className="flex-1 flex w-full">
        {/* Left Sidebar (Desktop only) */}
        <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-[#EAE5DE] sticky top-0 h-screen select-none shrink-0 z-40">
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-[#EAE5DE] flex items-center justify-between">
            <button
              onClick={() => onNavigateHome ? onNavigateHome() : onSelectTab('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#4B0718] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <span className="font-['Cinzel',serif] text-xl font-bold tracking-wider text-[#4B0718]">EVEX</span>
                <span className="block text-[9px] font-semibold uppercase tracking-widest text-[#736B66] -mt-1">
                  Events Platform
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-[#4B0718] text-white shadow-xs'
                      : 'text-[#242424] hover:bg-[#F8F7F5] hover:text-[#4B0718]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#736B66]'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#4B0718]/10 text-[#4B0718]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Account / Profile Card at Bottom of Sidebar */}
          <div className="p-4 border-t border-[#EAE5DE] bg-white">
            {currentUser ? (
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#F8F7F5] border border-[#EAE5DE]">
                <div
                  onClick={() => onSelectTab('profile')}
                  className="flex items-center gap-2.5 overflow-hidden cursor-pointer flex-1"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-[#4B0718]/20 shrink-0"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#242424] truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-[#736B66] capitalize">{getRoleLabel()}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-[#736B66] hover:text-[#4B0718] hover:bg-white rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 px-4 bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold rounded-xl shadow-xs transition active:scale-95"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EAE5DE] px-4 md:px-8 py-3.5 flex items-center justify-between">
            {/* Left: Mobile hamburger & Global Search */}
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#242424] hover:bg-[#F8F7F5] border border-[#EAE5DE]"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Brand on Mobile Header */}
              <button
                onClick={() => onNavigateHome ? onNavigateHome() : onSelectTab('home')}
                className="lg:hidden flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#4B0718]" />
                <span className="font-['Cinzel',serif] text-base font-bold text-[#4B0718]">EVEX</span>
              </button>

              {/* Desktop Global Search bar */}
              <div className="hidden sm:flex items-center relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 text-[#736B66]" />
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Search events, services, or professionals..."
                  className="w-full bg-[#F8F7F5] border border-[#EAE5DE] rounded-xl py-2 pl-9 pr-4 text-xs text-[#242424] placeholder-[#736B66] focus:outline-none focus:border-[#4B0718] transition"
                />
              </div>
            </div>

            {/* Right: Actions, Notifications, User Menu */}
            <div className="flex items-center gap-3">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setShowNotifications(true)}
                    className="p-2 rounded-xl text-[#736B66] hover:text-[#4B0718] hover:bg-[#F8F7F5] border border-[#EAE5DE] relative transition"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#4B0718] border-2 border-white" />
                    )}
                  </button>

                  <div
                    onClick={() => onSelectTab('profile')}
                    className="flex items-center gap-2 cursor-pointer p-1 pr-2.5 rounded-xl border border-[#EAE5DE] bg-[#F8F7F5] hover:border-[#4B0718]/40 transition"
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="hidden md:inline text-xs font-bold text-[#242424]">
                      {currentUser.name}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onOpenAuth}
                    className="py-1.5 px-3.5 text-xs font-bold text-[#4B0718] hover:bg-[#4B0718]/5 rounded-xl transition"
                  >
                    Log In
                  </button>
                  <button
                    onClick={onOpenAuth}
                    className="py-1.5 px-4 bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold rounded-xl shadow-xs transition"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Main Body Viewport */}
          <main className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
            {children}
          </main>
        </div>
      </div>

      {/* =================================================================== */}
      {/* MOBILE SLIDE-OUT DRAWER                                             */}
      {/* =================================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition"
          />

          <div className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col z-10 shadow-2xl">
            <div className="p-5 border-b border-[#EAE5DE] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#4B0718]" />
                <span className="font-['Cinzel',serif] text-lg font-bold text-[#4B0718]">EVEX</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-[#736B66] hover:bg-[#F8F7F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-[#4B0718] text-white'
                        : 'text-[#242424] hover:bg-[#F8F7F5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white/20">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {currentUser && (
              <div className="p-4 border-t border-[#EAE5DE]">
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      <NotificationDrawer isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </div>
  );
};
