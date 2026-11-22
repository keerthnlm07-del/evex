import React, { useState } from 'react';
import { ArrowLeft, Award, Check, X, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const CompareProposals = ({ onBack, onAcceptProposal }) => {
  const { currentUser } = useAuth();
  const { proposals, requests, acceptProposal, rejectProposal } = useDatabase();
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Filter proposals belonging to this customer's requests
  const myRequestIds = requests
    .filter((r) => r.customerId === currentUser?.id)
    .map((r) => r.id);

  const myProposals = proposals.filter((p) =>
    myRequestIds.includes(p.requestId)
  );

  const handleAccept = (prop) => {
    acceptProposal(prop, currentUser);
    setSelectedProposal(null);
    onAcceptProposal?.(prop);
  };

  const handleReject = (propId) => {
    rejectProposal(propId);
    setSelectedProposal(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Header matching reference: `< Proposals Received` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-black tracking-tight text-white">Proposals Received</h2>
      </div>

      {/* Proposals List matching reference */}
      <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3">
        {myProposals.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-dashed border-[#EDE0D7] text-center my-auto">
            <Award className="w-10 h-10 text-[#8B7377] mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-[#260C13]">No Proposals Received Yet</h4>
            <p className="text-xs text-[#8B7377] mt-1">
              Event managers review submitted requirements and provide customized packages here.
            </p>
          </div>
        ) : (
          myProposals.map((prop) => (
            <div
              key={prop.id}
              className="p-4 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#260C13]">{prop.managerName}</h3>
                  <p className="text-sm font-black text-[#4B0718] mt-0.5">
                    ₹{Number(prop.proposedPrice).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-[#8B7377] flex items-center gap-1">
                    <span className="text-emerald-700 font-bold">✔</span>
                    <span>
                      {prop.servicesIncluded?.[0] || 'Full service package'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Burgundy View Button matching reference */}
              <button
                onClick={() => setSelectedProposal(prop)}
                className="py-1.5 px-4 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold transition active:scale-95 shadow-xs"
              >
                View
              </button>
            </div>
          ))
        )}
      </div>

      {/* View Details / Accept Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl border border-[#EDE0D7] text-[#260C13] animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#EDE0D7] pb-3">
              <div>
                <span className="text-[10px] font-bold text-[#8B7377] uppercase">Proposal Details</span>
                <h3 className="font-black text-base text-[#260C13]">{selectedProposal.managerName}</h3>
              </div>
              <button
                onClick={() => setSelectedProposal(null)}
                className="p-1 rounded-lg text-[#8B7377] hover:text-[#260C13]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFF8F3] border border-[#EDE0D7] space-y-1">
              <span className="text-[11px] text-[#8B7377]">Total Proposed Quote:</span>
              <p className="text-xl font-black text-[#4B0718]">
                ₹{Number(selectedProposal.proposedPrice).toLocaleString('en-IN')}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-[#260C13] mb-1.5">Deliverables Included:</p>
              <div className="space-y-1 text-xs text-[#260C13]">
                {selectedProposal.servicesIncluded?.map((srv, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="text-emerald-700 font-bold">✔</span>
                    <span>{srv}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedProposal.additionalDetails && (
              <p className="text-xs text-[#8B7377] italic bg-[#FFF8F3] p-2.5 rounded-xl border border-[#EDE0D7]">
                “{selectedProposal.additionalDetails}”
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleReject(selectedProposal.id)}
                className="py-2.5 px-3 rounded-xl border border-[#EDE0D7] bg-[#FFF8F3] text-rose-700 font-bold text-xs hover:bg-rose-50 transition"
              >
                Decline
              </button>
              <button
                onClick={() => handleAccept(selectedProposal)}
                className="flex-1 py-2.5 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white font-bold text-xs shadow-md transition active:scale-95"
              >
                Accept Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
