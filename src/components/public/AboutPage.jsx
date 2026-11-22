import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Award, Users, Mail, Phone, MapPin } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4B0718]/10 text-[#4B0718] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Vision</span>
        </div>
        <h1 className="text-3xl font-bold text-[#242424]">About EVEX</h1>
        <p className="text-sm text-[#736B66] mt-1 max-w-2xl leading-relaxed">
          EVEX is modernizing event commerce by uniting event planners, verified agencies, and on-demand creative workforce in a single high-trust platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs">
          <ShieldCheck className="w-8 h-8 text-[#4B0718] mb-3" />
          <h3 className="text-sm font-bold text-[#242424] mb-1">Integrity & Quality</h3>
          <p className="text-xs text-[#736B66] leading-relaxed">
            Every listed manager and talent profile is verified with portfolio references to ensure premier event execution.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs">
          <HeartHandshake className="w-8 h-8 text-[#4B0718] mb-3" />
          <h3 className="text-sm font-bold text-[#242424] mb-1">Fair & Transparent</h3>
          <p className="text-xs text-[#736B66] leading-relaxed">
            No hidden commissions. Clear quotes, upfront service scopes, and safe escrow simulation models.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs">
          <Users className="w-8 h-8 text-[#4B0718] mb-3" />
          <h3 className="text-sm font-bold text-[#242424] mb-1">Workforce Empowerment</h3>
          <p className="text-xs text-[#736B66] leading-relaxed">
            Connecting students, hospitality professionals, and creative talent to guaranteed shifts with verified daily earnings.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF8F3] to-[#F4E8DF]/60 border border-[#EAE5DE]">
        <h3 className="text-base font-bold text-[#242424] mb-2">Contact & Inquiries</h3>
        <p className="text-xs text-[#736B66] mb-4">
          Need support with a booking or want to register an agency enterprise? Reach our team anytime.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#242424]">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#4B0718]" />
            <span>support@evex.app</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#4B0718]" />
            <span>+91 80 4920 1820</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#4B0718]" />
            <span>Bengaluru, Karnataka, India</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LegalPage = ({ type = 'privacy' }) => {
  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-10 max-w-4xl mx-auto w-full space-y-6">
      <h1 className="text-2xl font-bold text-[#242424]">
        {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
      </h1>
      <div className="p-6 rounded-2xl bg-white border border-[#EAE5DE] text-xs text-[#736B66] space-y-4 leading-relaxed">
        <p>
          Last updated: November 2026. EVEX is committed to protecting the privacy of clients, event planners, and gig professionals.
        </p>
        <h4 className="font-bold text-[#242424] text-sm">1. Data Collection & Privacy</h4>
        <p>
          Personal information such as email addresses and phone numbers are stored strictly in private user collections with owner-only access rules. Public directories expose only business names, portfolios, verified badges, and ratings.
        </p>
        <h4 className="font-bold text-[#242424] text-sm">2. Payments & Transaction Records</h4>
        <p>
          Payment records are stored in immutable audit ledgers. In sandbox mode, transactions are clearly marked as simulation settled.
        </p>
        <h4 className="font-bold text-[#242424] text-sm">3. Code of Conduct</h4>
        <p>
          All event managers agree to provide high-quality service matching accepted proposals, and registered seekers agree to report punctually for assigned event shifts.
        </p>
      </div>
    </div>
  );
};
