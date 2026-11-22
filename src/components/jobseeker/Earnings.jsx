import React, { useState } from 'react';
import {
  Wallet,
  IndianRupee,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  Building2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const Earnings = () => {
  const { currentUser } = useAuth();
  const { earnings } = useDatabase();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('rohan@okhdfc');
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const myEarnings = earnings[currentUser?.id] || {
    totalEarned: 44200,
    pendingPayout: 2200,
    gigsCompleted: 28,
    payoutHistory: [
      {
        id: 'po_1',
        gigTitle: 'Grand Sangeet Banquet Service',
        date: '2026-10-20',
        amount: 3600,
        status: 'Credited to HDFC **** 9012'
      },
      {
        id: 'po_2',
        gigTitle: 'Pharma Conclave Delegate Usher',
        date: '2026-10-14',
        amount: 2000,
        status: 'Credited to UPI (rohan@okhdfc)'
      }
    ]
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setWithdrawSuccess(true);
      setTimeout(() => {
        setWithdrawSuccess(false);
        setShowWithdrawModal(false);
      }, 1200);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-6 space-y-4 overflow-y-auto no-scrollbar">
      <div>
        <h2 className="text-xl font-extrabold text-white">Gig Earnings & Payouts</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Daily wage settlements & bank transfers
        </p>
      </div>

      {/* Main Balance Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0B261F] via-[#0F392F] to-[#0A241D] border border-emerald-900/50 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
            Escrow Released
          </span>
          <span className="text-xs text-emerald-200 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Instant UPI Payouts
          </span>
        </div>

        <div>
          <p className="text-xs text-slate-300 font-medium">Cumulative Gig Income</p>
          <h3 className="text-3xl font-black text-white mt-0.5">
            ₹{myEarnings.totalEarned.toLocaleString('en-IN')}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-emerald-800/40 text-xs">
          <div>
            <p className="text-[10px] text-slate-300">Pending Release</p>
            <p className="font-extrabold text-amber-300">
              ₹{myEarnings.pendingPayout.toLocaleString('en-IN')}
            </p>
          </div>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-lg shadow-emerald-500/30 transition active:scale-95"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-[#12192D] border border-slate-800 text-center">
          <p className="text-xl font-black text-white">{myEarnings.gigsCompleted}</p>
          <p className="text-xs text-slate-400 mt-0.5">Completed Gigs</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#12192D] border border-slate-800 text-center">
          <p className="text-xl font-black text-emerald-400">100%</p>
          <p className="text-xs text-slate-400 mt-0.5">On-Time Pay Record</p>
        </div>
      </div>

      {/* Payout History */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Recent Payout Statements
        </h3>

        {myEarnings.payoutHistory?.map((p) => (
          <div
            key={p.id}
            className="p-3.5 rounded-2xl bg-[#12192D] border border-slate-800/80 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-white">{p.gigTitle}</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {p.status} • {p.date}
                </p>
              </div>
            </div>

            <span className="text-xs font-black text-emerald-400">
              +₹{p.amount.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>

      {/* WITHDRAW MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#10172A] border border-emerald-900/50 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white text-base">Withdraw Gig Earnings</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-white text-base">Withdrawal Dispatched!</h4>
                <p className="text-xs text-slate-300">
                  ₹{myEarnings.totalEarned.toLocaleString('en-IN')} transferred via Instant UPI IMPS.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-3">
                <div className="p-3 rounded-2xl bg-[#141C35] border border-slate-800">
                  <p className="text-[10px] text-slate-400">Available to Withdraw:</p>
                  <p className="text-lg font-black text-emerald-400">
                    ₹{myEarnings.totalEarned.toLocaleString('en-IN')}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Beneficiary UPI ID / VPA
                  </label>
                  <div className="relative">
                    <Smartphone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. name@upi"
                      className="w-full bg-[#141C35] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition active:scale-98"
                >
                  {isProcessing ? 'Connecting to Bank IMPS...' : 'Confirm Instant Transfer'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
