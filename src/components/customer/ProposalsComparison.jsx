import React, { useState } from 'react';
import {
  FileText,
  Star,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const ProposalsComparison = ({ onBack, onAcceptProposalSuccess }) => {
  const { currentUser } = useAuth();
  const { proposals, requests, acceptProposal, rejectProposal } = useDatabase();
  const [filter, setFilter] = useState('All'); // 'All' | 'Pending' | 'Accepted' | 'Rejected'
  const [selectedProposalDetails, setSelectedProposalDetails] = useState(null);

  // Filter proposals belonging to current customer's requests
  const myRequests = requests.filter(
    (r) => r.customerId === currentUser?.id || r.customerId === currentUser?.uid
  );
  const myProposals = proposals.filter((p) =>
    myRequests.some((r) => r.id === p.requestId)
  );

  // Fallback realistic proposals matching reference mockup if none in database yet
  const displayProposals = myProposals.length > 0 ? myProposals : [
    {
      id: 'prop_mock_1',
      requestId: 'req_1',
      eventName: 'Birthday Celebration',
      managerId: 'mgr_evex',
      managerName: 'EVEX Events Co.',
      managerAvatar: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=200',
      proposedPrice: 120000,
      servicesIncluded: ['Full event management', 'Catering', 'Floral Decor', 'DJ Sound'],
      additionalDetails: 'Comprehensive coordination with 8 stewards and personalized theme lighting.',
      rating: 4.9,
      reviewCount: 108,
      status: 'pending'
    },
    {
      id: 'prop_mock_2',
      requestId: 'req_1',
      eventName: 'Birthday Celebration',
      managerId: 'mgr_aura',
      managerName: 'Aura Celebrations',
      managerAvatar: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200',
      proposedPrice: 95000,
      servicesIncluded: ['Venue', 'Decor', 'Catering'],
      additionalDetails: 'Standard package with buffet setup and entrance balloon arch.',
      rating: 4.8,
      reviewCount: 85,
      status: 'pending'
    },
    {
      id: 'prop_mock_3',
      requestId: 'req_1',
      eventName: 'Birthday Celebration',
      managerId: 'mgr_eventique',
      managerName: 'Eventique Studio',
      managerAvatar: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=200',
      proposedPrice: 110000,
      servicesIncluded: ['Decor', 'Photography', 'Audio Rig'],
      additionalDetails: 'High-energy setup with photo booth and candid photographer.',
      rating: 4.7,
      reviewCount: 65,
      status: 'pending'
    }
  ];

  const filtered = displayProposals.filter((p) => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return p.status === 'pending';
    if (filter === 'Accepted') return p.status === 'accepted';
    if (filter === 'Rejected') return p.status === 'rejected';
    return true;
  });

  const handleAccept = async (prop) => {
    try {
      await acceptProposal(prop, currentUser);
      if (onAcceptProposalSuccess) onAcceptProposalSuccess(prop);
    } catch (err) {
      alert(`Error accepting proposal: ${err.message}`);
    }
  };

  const handleReject = async (propId) => {
    try {
      await rejectProposal(propId);
    } catch (err) {
      alert(`Error rejecting proposal: ${err.message}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Header matching reference mockup bottom-center-left */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#242424] flex items-center gap-2">
            <span>Proposals</span>
            <span className="text-sm font-semibold text-[#736B66]">({displayProposals.length})</span>
          </h1>
          <p className="text-xs text-[#736B66] mt-0.5">
            Review and compare quotes submitted by event agencies for your requests.
          </p>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-[#736B66] hover:bg-[#F8F7F5] border border-[#EAE5DE]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs matching reference mockup: All, Pending, Accepted, Rejected */}
      <div className="flex items-center gap-2">
        {['All', 'Pending', 'Accepted', 'Rejected'].map((tab) => {
          const isSelected = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                isSelected
                  ? 'bg-[#4B0718] text-white shadow-xs'
                  : 'bg-white border border-[#EAE5DE] text-[#736B66] hover:text-[#242424] hover:bg-[#F8F7F5]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Proposals List matching mockup cards */}
      <div className="space-y-4">
        {filtered.map((prop) => (
          <div
            key={prop.id}
            className="p-5 rounded-2xl bg-white border border-[#EAE5DE] shadow-xs hover:border-[#4B0718]/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {/* Left: Agency details & Pricing */}
            <div className="flex items-start gap-4">
              <img
                src={prop.managerAvatar || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=150'}
                alt={prop.managerName}
                className="w-14 h-14 rounded-xl object-cover border border-[#EAE5DE] shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#242424]">{prop.managerName}</h3>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{prop.rating || 4.8} ({prop.reviewCount || 85})</span>
                  </div>
                </div>

                <p className="text-xs text-[#736B66]">
                  {Array.isArray(prop.servicesIncluded)
                    ? prop.servicesIncluded.join(' • ')
                    : prop.servicesIncluded}
                </p>

                <p className="text-sm font-bold text-[#4B0718]">
                  ₹{Number(prop.proposedPrice).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 sm:self-center shrink-0">
              <button
                onClick={() => setSelectedProposalDetails(prop)}
                className="py-2 px-3.5 rounded-xl border border-[#EAE5DE] hover:bg-[#F8F7F5] text-xs font-bold text-[#242424] flex items-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              {prop.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleReject(prop.id)}
                    className="py-2 px-3 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleAccept(prop)}
                    className="py-2 px-4 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    Accept
                  </button>
                </>
              )}

              {prop.status === 'accepted' && (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accepted</span>
                </span>
              )}

              {prop.status === 'rejected' && (
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
                  Declined
                </span>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-10 rounded-2xl bg-white border border-[#EAE5DE] text-center text-xs text-[#736B66]">
            No {filter.toLowerCase()} proposals found.
          </div>
        )}
      </div>

      {/* Proposal Details Modal */}
      {selectedProposalDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EAE5DE] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DE]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProposalDetails.managerAvatar}
                  alt={selectedProposalDetails.managerName}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#242424]">{selectedProposalDetails.managerName}</h3>
                  <span className="text-[11px] text-[#736B66]">Verified Event Proposal</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProposalDetails(null)}
                className="p-1.5 rounded-lg text-[#736B66] hover:bg-[#F8F7F5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#FFF8F3] border border-[#EAE5DE] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#736B66]">Total Proposed Price:</span>
                <span className="font-bold text-[#4B0718] text-sm">
                  ₹{Number(selectedProposalDetails.proposedPrice).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#736B66]">Status:</span>
                <span className="font-bold capitalize">{selectedProposalDetails.status}</span>
              </div>
            </div>

            <div className="text-xs space-y-2">
              <span className="font-bold text-[#242424] block">Included Services:</span>
              <div className="flex flex-wrap gap-1.5">
                {(Array.isArray(selectedProposalDetails.servicesIncluded)
                  ? selectedProposalDetails.servicesIncluded
                  : [selectedProposalDetails.servicesIncluded]
                ).map((s, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#F8F7F5] border border-[#EAE5DE] text-[11px] font-semibold text-[#242424]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-xs space-y-1">
              <span className="font-bold text-[#242424] block">Additional Details & Guarantee:</span>
              <p className="text-[#736B66] leading-relaxed bg-[#F8F7F5] p-3 rounded-xl border border-[#EAE5DE]">
                {selectedProposalDetails.additionalDetails || 'Includes dedicated on-site coordinator and 100% on-time execution guarantee.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE5DE]">
              <button
                onClick={() => setSelectedProposalDetails(null)}
                className="py-2 px-4 rounded-xl border border-[#EAE5DE] text-xs font-bold text-[#736B66] hover:bg-[#F8F7F5]"
              >
                Close
              </button>

              {selectedProposalDetails.status === 'pending' && (
                <button
                  onClick={() => {
                    handleAccept(selectedProposalDetails);
                    setSelectedProposalDetails(null);
                  }}
                  className="py-2 px-5 rounded-xl bg-[#4B0718] text-white text-xs font-bold hover:bg-[#350713]"
                >
                  Accept Proposal
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
