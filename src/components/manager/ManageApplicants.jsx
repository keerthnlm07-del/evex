import React from 'react';
import { ArrowLeft, Star, Users2, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const ManageApplicants = ({ onBack }) => {
  const { currentUser } = useAuth();
  const { applications, updateApplicationStatus } = useDatabase();

  const myApplications = applications.filter((a) => a.managerId === currentUser?.id);

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Top Header matching reference image: `< Applicants (10)` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-black tracking-tight text-white">
          Applicants ({myApplications.length})
        </h2>
      </div>

      {/* Applicants List matching reference image */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3">
        {myApplications.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-dashed border-[#EDE0D7] text-center my-auto">
            <Users2 className="w-10 h-10 text-[#8B7377] mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-[#260C13]">No Applicants Yet</h4>
            <p className="text-xs text-[#8B7377] mt-1">
              When job seekers apply for your event gigs, their credentials will be listed here.
            </p>
          </div>
        ) : (
          myApplications.map((app) => (
            <div
              key={app.id}
              className="p-3.5 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    app.applicantAvatar ||
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
                  }
                  alt={app.applicantName}
                  className="w-12 h-12 rounded-full object-cover border border-[#EDE0D7] shrink-0"
                />

                <div>
                  <h4 className="font-extrabold text-sm text-[#260C13]">{app.applicantName}</h4>
                  <p className="text-xs text-[#8B7377] mt-0.5">
                    {app.applicantRole || app.jobTitle} · {app.applicantExperience || '2 yrs'}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-amber-700 font-bold mt-0.5">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{app.applicantRating || 4.7}</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Burgundy Accept / Status Pill matching reference */}
              {app.status === 'accepted' ? (
                <span className="py-1 px-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  Accepted
                </span>
              ) : app.status === 'rejected' ? (
                <span className="py-1 px-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
                  Declined
                </span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateApplicationStatus(app.id, 'accepted')}
                    className="py-1.5 px-3.5 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold shadow-xs transition active:scale-95"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(app.id, 'rejected')}
                    className="p-1.5 rounded-xl border border-[#EDE0D7] text-[#8B7377] hover:text-rose-700 hover:bg-rose-50 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
