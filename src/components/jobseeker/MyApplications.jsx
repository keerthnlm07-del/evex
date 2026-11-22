import React, { useState } from 'react';
import { ArrowLeft, FileCheck2, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const MyApplications = ({ onBack, onSelectApplication }) => {
  const { currentUser } = useAuth();
  const { applications } = useDatabase();
  const [activeTab, setActiveTab] = useState('all');

  const userId = currentUser?.id || currentUser?.uid;
  const myApps = applications.filter((a) => a.applicantId === userId);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'applied', label: 'Applied' },
    { id: 'selected', label: 'Selected' },
    { id: 'completed', label: 'Completed' }
  ];

  const filtered = myApps.filter((app) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'applied') return app.status === 'applied' || app.status === 'under_review';
    if (activeTab === 'selected') return app.status === 'selected' || app.status === 'accepted';
    if (activeTab === 'completed') return app.status === 'completed';
    return true;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Top Header matching reference image: `< My Applications` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-black tracking-tight text-white">My Applications</h2>
      </div>

      {/* Tabs matching reference: All | Applied | Selected | Completed */}
      <div className="p-3 bg-white border-b border-[#EDE0D7] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition ${
                isActive
                  ? 'bg-[#4B0718] text-white shadow-xs'
                  : 'bg-[#FFF8F3] text-[#8B7377] hover:text-[#260C13]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Application Cards List matching reference image */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-dashed border-[#EDE0D7] text-center my-auto">
            <FileCheck2 className="w-10 h-10 text-[#8B7377] mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-[#260C13]">No Applications in this Category</h4>
            <p className="text-xs text-[#8B7377] mt-1">
              Apply to active event job listings to build your gig track record.
            </p>
          </div>
        ) : (
          filtered.map((app) => {
            const isSelected = app.status === 'accepted' || app.status === 'selected';
            const isUnderReview = app.status === 'under_review' || app.status === 'applied';

            return (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs flex items-center justify-between"
              >
                <div>
                  <h3 className="font-extrabold text-sm text-[#260C13]">{app.jobTitle}</h3>
                  <p className="text-xs font-medium text-[#8B7377] mt-0.5">{app.managerName}</p>

                  {/* Status Pill matching reference */}
                  <div className="mt-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isUnderReview
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Status: {isSelected ? 'Selected' : isUnderReview ? 'Under Review' : app.status}
                    </span>
                  </div>
                </div>

                {/* Burgundy View Button matching reference */}
                <button
                  onClick={() =>
                    alert(
                      `Application ID: ${app.id}\nPosition: ${app.jobTitle}\nAgency: ${app.managerName}\nStatus: ${
                        isSelected ? 'Accepted & Confirmed' : 'Under Review by Agency'
                      }`
                    )
                  }
                  className="py-1.5 px-4 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold shadow-xs transition active:scale-95"
                >
                  View
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
