import React from 'react';

export const StatusBadge = ({ status, size = 'sm' }) => {
  const getStatusConfig = (st) => {
    switch (st?.toLowerCase()) {
      case 'open':
        return {
          label: 'Inquiry Open',
          bg: 'bg-blue-500/15',
          text: 'text-blue-400',
          border: 'border-blue-500/30',
          dot: 'bg-blue-400'
        };
      case 'proposals_received':
        return {
          label: 'Proposals Ready',
          bg: 'bg-purple-500/15',
          text: 'text-purple-300',
          border: 'border-purple-500/30',
          dot: 'bg-purple-400 animate-pulse'
        };
      case 'confirmed':
      case 'booked':
      case 'accepted':
      case 'success':
        return {
          label: st === 'confirmed' ? 'Confirmed' : st === 'accepted' ? 'Accepted' : 'Confirmed',
          bg: 'bg-emerald-500/15',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          dot: 'bg-emerald-400'
        };
      case 'completed':
        return {
          label: 'Completed',
          bg: 'bg-indigo-500/15',
          text: 'text-indigo-300',
          border: 'border-indigo-500/30',
          dot: 'bg-indigo-400'
        };
      case 'under_review':
        return {
          label: 'Under Review',
          bg: 'bg-amber-500/15',
          text: 'text-amber-300',
          border: 'border-amber-500/30',
          dot: 'bg-amber-400 animate-pulse'
        };
      case 'applied':
        return {
          label: 'Applied',
          bg: 'bg-sky-500/15',
          text: 'text-sky-300',
          border: 'border-sky-500/30',
          dot: 'bg-sky-400'
        };
      case 'rejected':
      case 'declined_by_manager':
      case 'cancelled':
        return {
          label: st === 'rejected' ? 'Declined' : 'Closed',
          bg: 'bg-rose-500/15',
          text: 'text-rose-400',
          border: 'border-rose-500/30',
          dot: 'bg-rose-400'
        };
      case 'partially_paid':
        return {
          label: 'Partially Paid',
          bg: 'bg-amber-500/15',
          text: 'text-amber-300',
          border: 'border-amber-500/30',
          dot: 'bg-amber-400'
        };
      case 'fully_paid':
        return {
          label: 'Fully Paid',
          bg: 'bg-emerald-500/15',
          text: 'text-emerald-400',
          border: 'border-emerald-500/30',
          dot: 'bg-emerald-400'
        };
      case 'unpaid':
        return {
          label: 'Advance Due',
          bg: 'bg-rose-500/15',
          text: 'text-rose-300',
          border: 'border-rose-500/30',
          dot: 'bg-rose-400'
        };
      default:
        return {
          label: st || 'Active',
          bg: 'bg-slate-500/15',
          text: 'text-slate-300',
          border: 'border-slate-500/30',
          dot: 'bg-slate-400'
        };
    }
  };

  const config = getStatusConfig(status);
  const isXs = size === 'xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${
        isXs ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
