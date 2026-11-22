import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { ResponsiveShell } from './components/common/ResponsiveShell';
import { BottomNav } from './components/common/BottomNav';
import { Loader2, Sparkles } from 'lucide-react';

// Public Website & Auth
import { LandingPage } from './components/public/LandingPage';
import { ExploreServicesPage } from './components/public/ExploreServicesPage';
import { HowItWorksPage } from './components/public/HowItWorksPage';
import { AboutPage, LegalPage } from './components/public/AboutPage';
import { AuthModal } from './components/auth/AuthModal';

// Customer Portal
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { CreateEventWizard } from './components/customer/CreateEventWizard';
import { ProposalsComparison } from './components/customer/ProposalsComparison';
import { CustomerBookings } from './components/customer/CustomerBookings';
import { BookingDetails } from './components/customer/BookingDetails';
import { CustomerPayments } from './components/customer/CustomerPayments';
import { CustomerProfile } from './components/customer/CustomerProfile';
import { ExploreManagers } from './components/customer/ExploreManagers';

// Event Manager Portal
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { CustomerRequests } from './components/manager/CustomerRequests';
import { CreateProposal } from './components/manager/CreateProposal';
import { ManagerBookings } from './components/manager/ManagerBookings';
import { RecruitmentPostJob } from './components/manager/RecruitmentPostJob';
import { ManageApplicants } from './components/manager/ManageApplicants';
import { ManagerProfile } from './components/manager/ManagerProfile';
import { AnalyticsView } from './components/manager/AnalyticsView';

// Job Seeker Portal
import { JobSeekerDashboard } from './components/jobseeker/JobSeekerDashboard';
import { FindJobs } from './components/jobseeker/FindJobs';
import { JobDetails } from './components/jobseeker/JobDetails';
import { MyApplications } from './components/jobseeker/MyApplications';
import { MyEarnings } from './components/jobseeker/MyEarnings';
import { JobSeekerProfile } from './components/jobseeker/JobSeekerProfile';

// Shared Components
import { EventCalendar } from './components/common/EventCalendar';
import { MessagingView } from './components/common/MessagingView';

const AppContent = () => {
  const { currentUser, authLoading } = useAuth();

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState('home');

  // Overlays / Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');

  const [activeBookingForDetails, setActiveBookingForDetails] = useState(null);
  const [activeJobForDetails, setActiveJobForDetails] = useState(null);
  const [activeRequestForProposal, setActiveRequestForProposal] = useState(null);
  const [prefilledEventCategory, setPrefilledEventCategory] = useState(null);

  // Initial loading splash while Firebase Auth checks persistent session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#4B0718] flex items-center justify-center text-white shadow-xl animate-pulse">
          <Sparkles className="w-7 h-7 text-amber-200" />
        </div>
        <div className="text-center">
          <h1 className="font-['Cinzel',serif] text-2xl font-bold tracking-widest text-[#4B0718]">EVEX</h1>
          <p className="text-xs text-[#736B66] mt-1 font-medium">Connecting Events & Opportunities</p>
        </div>
        <Loader2 className="w-5 h-5 text-[#4B0718] animate-spin mt-2" />
      </div>
    );
  }

  const role = currentUser?.role;

  return (
    <ResponsiveShell
      activeTab={currentTab}
      onSelectTab={(tab) => setCurrentTab(tab)}
      onOpenAuth={() => {
        setAuthModalMode('signin');
        setAuthModalOpen(true);
      }}
      onNavigateHome={() => setCurrentTab('home')}
    >
      {/* =================================================================== */}
      {/* 1. PUBLIC WEBSITE (When user is not logged in)                     */}
      {/* =================================================================== */}
      {!currentUser && (
        <>
          {(currentTab === 'home' || currentTab === 'landing') && (
            <LandingPage
              onOpenAuth={() => {
                setAuthModalMode('signup');
                setAuthModalOpen(true);
              }}
              onPlanEvent={() => {
                setAuthModalMode('signup');
                setAuthModalOpen(true);
              }}
              onExploreServices={() => setCurrentTab('explore-services')}
              onFindJobs={() => setCurrentTab('find-jobs')}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'explore-services' && (
            <ExploreServicesPage
              onPlanEvent={(cat) => {
                setPrefilledEventCategory(cat);
                setAuthModalMode('signup');
                setAuthModalOpen(true);
              }}
            />
          )}

          {currentTab === 'find-jobs' && (
            <FindJobs
              onSelectJob={(job) => {
                setActiveJobForDetails(job);
                setAuthModalMode('signup');
                setAuthModalOpen(true);
              }}
            />
          )}

          {currentTab === 'how-it-works' && (
            <HowItWorksPage
              onPlanEvent={() => { setAuthModalMode('signup'); setAuthModalOpen(true); }}
              onExploreServices={() => setCurrentTab('explore-services')}
              onFindJobs={() => setCurrentTab('find-jobs')}
            />
          )}

          {currentTab === 'about' && <AboutPage />}
          {currentTab === 'privacy' && <LegalPage type="privacy" />}
          {currentTab === 'terms' && <LegalPage type="terms" />}
        </>
      )}

      {/* =================================================================== */}
      {/* 2. CUSTOMER PORTAL                                                  */}
      {/* =================================================================== */}
      {currentUser && role === 'customer' && (
        <>
          {currentTab === 'home' && (
            <CustomerDashboard
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenPlanEvent={() => setCurrentTab('plan-event')}
              onSelectBooking={(b) => {
                setActiveBookingForDetails(b);
                setCurrentTab('booking-details');
              }}
              onViewProposals={() => setCurrentTab('proposals')}
            />
          )}

          {currentTab === 'plan-event' && (
            <CreateEventWizard
              initialCategory={prefilledEventCategory}
              onBack={() => setCurrentTab('home')}
              onSuccess={() => setCurrentTab('bookings')}
            />
          )}

          {currentTab === 'proposals' && (
            <ProposalsComparison
              onBack={() => setCurrentTab('home')}
              onAcceptProposalSuccess={(prop) => setCurrentTab('bookings')}
            />
          )}

          {currentTab === 'bookings' && (
            <CustomerBookings
              onSelectBooking={(b) => {
                setActiveBookingForDetails(b);
                setCurrentTab('booking-details');
              }}
            />
          )}

          {currentTab === 'booking-details' && activeBookingForDetails && (
            <BookingDetails
              booking={activeBookingForDetails}
              onBack={() => setCurrentTab('bookings')}
              onPayBalance={(b) => {
                setActiveBookingForDetails(b);
                setCurrentTab('payments');
              }}
              onOpenChat={() => setCurrentTab('messages')}
            />
          )}

          {currentTab === 'payments' && (
            <CustomerPayments
              initialBookingToPay={activeBookingForDetails}
              onBack={() => setCurrentTab('bookings')}
            />
          )}

          {currentTab === 'messages' && (
            <MessagingView onBack={() => setCurrentTab('home')} />
          )}

          {currentTab === 'explore' && (
            <ExploreManagers
              onSelectManager={(mgr) => {
                setCurrentTab('plan-event');
              }}
            />
          )}

          {currentTab === 'saved' && (
            <ExploreManagers
              initialFavoritesOnly={true}
              onSelectManager={(mgr) => setCurrentTab('plan-event')}
            />
          )}

          {currentTab === 'calendar' && (
            <EventCalendar onBack={() => setCurrentTab('home')} />
          )}

          {currentTab === 'reviews' && (
            <div className="p-6 max-w-4xl mx-auto space-y-4">
              <h2 className="text-xl font-bold text-[#242424]">Event Reviews & Ratings</h2>
              <p className="text-xs text-[#736B66]">Verified client feedback on event managers.</p>
              <ExploreManagers onSelectManager={() => setCurrentTab('plan-event')} />
            </div>
          )}

          {currentTab === 'profile' && <CustomerProfile />}
        </>
      )}

      {/* =================================================================== */}
      {/* 3. EVENT MANAGER PORTAL                                             */}
      {/* =================================================================== */}
      {currentUser && role === 'manager' && (
        <>
          {currentTab === 'home' && (
            <ManagerDashboard
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenCreateProposal={() => setCurrentTab('requests')}
              onOpenPostGig={() => setCurrentTab('post-job')}
              onOpenAddService={() => setCurrentTab('services')}
              onOpenManageTeam={() => setCurrentTab('team')}
              onSelectBooking={(b) => {
                setActiveBookingForDetails(b);
                setCurrentTab('bookings');
              }}
            />
          )}

          {currentTab === 'requests' && (
            <CustomerRequests
              onSelectRequest={(req) => {
                setActiveRequestForProposal(req);
                setCurrentTab('create-proposal');
              }}
            />
          )}

          {currentTab === 'create-proposal' && (
            <CreateProposal
              request={activeRequestForProposal || { id: 'req_1', eventName: 'Corporate Gala', requiredServices: ['Catering', 'Decor'] }}
              onBack={() => setCurrentTab('requests')}
              onSuccess={() => setCurrentTab('proposals')}
            />
          )}

          {currentTab === 'proposals' && (
            <CustomerRequests
              onSelectRequest={(req) => {
                setActiveRequestForProposal(req);
                setCurrentTab('create-proposal');
              }}
            />
          )}

          {currentTab === 'bookings' && (
            <ManagerBookings onSelectBooking={() => setCurrentTab('team')} />
          )}

          {currentTab === 'calendar' && (
            <EventCalendar onBack={() => setCurrentTab('home')} />
          )}

          {currentTab === 'services' && (
            <ExploreServicesPage onPlanEvent={() => setCurrentTab('requests')} />
          )}

          {currentTab === 'recruitment' && (
            <RecruitmentPostJob onBack={() => setCurrentTab('home')} onSuccess={() => setCurrentTab('team')} />
          )}

          {currentTab === 'post-job' && (
            <RecruitmentPostJob onBack={() => setCurrentTab('home')} onSuccess={() => setCurrentTab('team')} />
          )}

          {currentTab === 'team' && (
            <ManageApplicants onBack={() => setCurrentTab('home')} />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView onBack={() => setCurrentTab('home')} />
          )}

          {currentTab === 'messages' && (
            <MessagingView onBack={() => setCurrentTab('home')} />
          )}

          {currentTab === 'profile' && <ManagerProfile />}
        </>
      )}

      {/* =================================================================== */}
      {/* 4. JOB SEEKER PORTAL                                                */}
      {/* =================================================================== */}
      {currentUser && role === 'seeker' && (
        <>
          {currentTab === 'home' && (
            <JobSeekerDashboard
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onSelectJob={(job) => {
                setActiveJobForDetails(job);
                setCurrentTab('job-details');
              }}
              onApplySuccess={() => setCurrentTab('applications')}
            />
          )}

          {currentTab === 'jobs' && (
            <FindJobs
              onSelectJob={(job) => {
                setActiveJobForDetails(job);
                setCurrentTab('job-details');
              }}
            />
          )}

          {currentTab === 'job-details' && activeJobForDetails && (
            <JobDetails
              job={activeJobForDetails}
              onBack={() => setCurrentTab('jobs')}
              onApplySuccess={() => setCurrentTab('applications')}
            />
          )}

          {currentTab === 'applications' && (
            <MyApplications onSelectApplication={() => setCurrentTab('earnings')} />
          )}

          {currentTab === 'assignments' && (
            <EventCalendar onBack={() => setCurrentTab('home')} />
          )}

          {currentTab === 'saved' && (
            <FindJobs
              onSelectJob={(job) => {
                setActiveJobForDetails(job);
                setCurrentTab('job-details');
              }}
            />
          )}

          {currentTab === 'earnings' && (
            <MyEarnings onBack={() => setCurrentTab('home')} />
          )}

          {currentTab === 'messages' && (
            <MessagingView onBack={() => setCurrentTab('home')} />
          )}

          {currentTab === 'profile' && <JobSeekerProfile />}
        </>
      )}

      {/* Mobile Bottom Navigation (Hidden on desktop via lg:hidden) */}
      {currentUser && (
        <BottomNav
          activeTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
        />
      )}

      {/* Global Tabbed Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={() => setCurrentTab('home')}
      />
    </ResponsiveShell>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <AppContent />
      </DatabaseProvider>
    </AuthProvider>
  );
}
