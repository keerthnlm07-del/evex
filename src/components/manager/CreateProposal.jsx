import React, { useState } from 'react';
import { ArrowLeft, IndianRupee, Check, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const CreateProposal = ({ request, onBack, onSuccess }) => {
  const { currentUser } = useAuth();
  const { createProposal } = useDatabase();

  const [proposedPrice, setProposedPrice] = useState(
    request?.budget ? request.budget.toString() : '2,80,000'
  );
  const [includedServices, setIncludedServices] = useState(['Catering', 'Decoration', 'Photography']);
  const [additionalDetails, setAdditionalDetails] = useState(
    'Full service package with professional on-site coordinator.'
  );
  const [loading, setLoading] = useState(false);

  const availableServices = [
    'Catering',
    'Decoration',
    'Photography',
    'Venue Management',
    'Sound & Lighting'
  ];

  const toggleService = (srv) => {
    setIncludedServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv]
    );
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!request) return;

    setLoading(true);
    setTimeout(() => {
      const cleanPrice = Number(proposedPrice.replace(/[^0-9]/g, '')) || 280000;
      createProposal(request, currentUser, {
        proposedPrice: cleanPrice,
        includedServices,
        additionalDetails
      });

      setLoading(false);
      onSuccess?.();
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Top Header matching reference image: `< Create Proposal` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        <button
          onClick={onBack}
          className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-black tracking-tight text-white">Create Proposal</h2>
      </div>

      <form onSubmit={handleSend} className="flex-1 p-5 overflow-y-auto no-scrollbar space-y-4">
        <div className="p-5 rounded-3xl bg-white border border-[#EDE0D7] shadow-xs space-y-4">
          {/* Target Event */}
          <div>
            <label className="block text-xs font-bold text-[#8B7377] mb-1">For:</label>
            <p className="text-sm font-black text-[#260C13] bg-[#FFF8F3] p-2.5 rounded-xl border border-[#EDE0D7]">
              {request?.eventName || 'Wedding Function'}
            </p>
          </div>

          {/* Proposed Price */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1">Proposed Price (₹)</label>
            <div className="relative">
              <input
                type="text"
                required
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                placeholder="2,80,000"
                className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl py-2.5 pl-3 pr-10 text-xs font-bold text-[#4B0718] focus:outline-none focus:border-[#4B0718]"
              />
              <IndianRupee className="w-4 h-4 absolute right-3.5 top-3 text-[#8B7377]" />
            </div>
          </div>

          {/* Service Breakdown matching reference */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-2">Service Breakdown</label>
            <div className="space-y-2">
              {availableServices.map((srv) => {
                const checked = includedServices.includes(srv);
                return (
                  <div
                    key={srv}
                    onClick={() => toggleService(srv)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition ${
                      checked
                        ? 'bg-[#FFF8F3] border-[#4B0718] text-[#260C13]'
                        : 'bg-white border-[#EDE0D7] text-[#8B7377]'
                    }`}
                  >
                    <span>{srv}</span>
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        checked ? 'bg-[#4B0718] border-[#4B0718] text-white' : 'border-[#8B7377]'
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-xs font-bold text-[#260C13] mb-1">Additional Details</label>
            <textarea
              rows={3}
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Package inclusions, team size, equipment..."
              className="w-full bg-[#FFF8F3] border border-[#EDE0D7] rounded-xl p-2.5 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718] resize-none"
            />
          </div>
        </div>

        {/* Burgundy Send Proposal button matching reference */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#4B0718] hover:bg-[#350713] active:scale-98 text-white font-bold text-base shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Sending Proposal...' : 'Send Proposal'}
          </button>
        </div>
      </form>
    </div>
  );
};
