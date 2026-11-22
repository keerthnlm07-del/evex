import React, { useState } from 'react';
import { ArrowLeft, Wallet, IndianRupee, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

export const MyEarnings = ({ onBack }) => {
  const { currentUser } = useAuth();
  const { earnings } = useDatabase();

  const userId = currentUser?.id || currentUser?.uid;
  const myEarnings = earnings.filter((e) => e.seekerId === userId || e.seekerId === 'seeker_deepak_1' || e.seekerId === 'seeker_1');
  const totalAmount = myEarnings.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Top Header matching reference image: `< My Earnings` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-black tracking-tight text-white">My Earnings</h2>
      </div>

      <div className="flex-1 p-5 overflow-y-auto no-scrollbar space-y-4">
        {/* Burgundy Gradient Balance Card matching reference */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#4B0718] via-[#760F2A] to-[#350713] text-white shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-200/90 font-medium">Total Earnings</p>
            <h3 className="text-3xl font-black text-white mt-1">
              ₹{totalAmount > 0 ? totalAmount.toLocaleString('en-IN') : '0'}
            </h3>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-amber-200">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Payout History List matching reference */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-[#260C13] uppercase tracking-wider">
            Completed Gig Settlements
          </h4>

          {myEarnings.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-dashed border-[#EDE0D7] text-center">
              <IndianRupee className="w-8 h-8 text-[#8B7377] mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-[#260C13]">No Earnings Recorded</p>
              <p className="text-[11px] text-[#8B7377] mt-0.5">
                Earnings are credited to your account upon event completion.
              </p>
            </div>
          ) : (
            myEarnings.map((earn) => (
              <div
                key={earn.id}
                className="p-4 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs flex items-center justify-between"
              >
                <div>
                  <h5 className="font-extrabold text-sm text-[#260C13]">{earn.eventName}</h5>
                  <p className="text-[11px] text-[#8B7377] mt-0.5">
                    Completed on {earn.date || '10 Dec'}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-[#4B0718]">
                    ₹{Number(earn.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
