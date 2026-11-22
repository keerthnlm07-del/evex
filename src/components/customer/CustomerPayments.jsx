import React, { useState } from 'react';
import {
  ArrowLeft,
  CreditCard,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  QrCode,
  Smartphone,
  Building2,
  X,
  Receipt,
  Download,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import { initiateRazorpayCheckout } from '../../services/razorpay';
import { ReceiptModal } from '../common/ReceiptModal';

export const CustomerPayments = ({ initialBookingToPay, onBack }) => {
  const { currentUser } = useAuth();
  const { bookings, payments, processPayment } = useDatabase();

  const [showCheckout, setShowCheckout] = useState(Boolean(initialBookingToPay));
  const [selectedBookingId, setSelectedBookingId] = useState(
    initialBookingToPay?.id || bookings.find((b) => b.customerId === currentUser?.id || b.customerId === currentUser?.uid)?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState('UPI (Google Pay / PhonePe / Paytm)');
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [viewReceipt, setViewReceipt] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Customer's bookings & payments strictly scoped by id or uid
  const userId = currentUser?.id || currentUser?.uid;
  const myBookings = bookings.filter((b) => b.customerId === userId);
  const myPayments = payments.filter((p) => p.customerId === userId);

  // Totals calculations
  const totalContractAmount = myBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalAmountPaid = myBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const totalRemainingBalance = myBookings.reduce((sum, b) => sum + (b.remainingAmount || 0), 0);

  const activeBooking = myBookings.find((b) => b.id === selectedBookingId) || myBookings[0];

  const handleOpenCheckout = (booking) => {
    setSelectedBookingId(booking.id);
    setCustomAmount(booking.remainingAmount?.toString() || '');
    setShowCheckout(true);
    setPaymentSuccess(null);
    setErrorMsg('');
  };

  const handleExecutePayment = async (e) => {
    e.preventDefault();
    if (!activeBooking) return;

    const amount = Number(customAmount) || activeBooking.remainingAmount;
    if (amount <= 0 || amount > activeBooking.remainingAmount) {
      setErrorMsg(`Please enter a valid amount between ₹1 and ₹${activeBooking.remainingAmount.toLocaleString('en-IN')}`);
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      await initiateRazorpayCheckout({
        booking: activeBooking,
        amount,
        customer: currentUser,
        paymentMethod,
        onSuccess: (verifiedPayment) => {
          // Process in DatabaseContext to update booking & payments ledger
          const receipt = processPayment({
            bookingId: activeBooking.id,
            amount,
            paymentMethod: verifiedPayment.paymentMethod,
            customer: currentUser
          });
          const fullReceipt = { ...verifiedPayment, ...receipt, receiptNo: verifiedPayment.receiptNo || receipt.receiptNo };
          setPaymentSuccess(fullReceipt);
          setIsProcessing(false);
        },
        onFailure: (err) => {
          setErrorMsg(err.reason || 'Payment failed or cancelled.');
          setIsProcessing(false);
        },
        onDismiss: () => {
          setIsProcessing(false);
        }
      });
    } catch (err) {
      setErrorMsg(err.message || 'Payment initiation failed.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FFF8F3] text-[#260C13]">
      {/* Top Header matching reference image: `< Payments` */}
      <div className="bg-[#4B0718] text-white py-4 px-4 flex items-center gap-3 shadow-xs">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-base font-black tracking-tight text-white">Payments & Invoices</h2>
      </div>

      <div className="flex-1 p-4 pb-6 space-y-4 overflow-y-auto no-scrollbar">
        {/* Gateway Status Pill */}
        <div className="p-3 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-[#260C13]">EVEX 256-Bit Escrow Vault</span>
          </div>
          <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
            Escrow Active
          </span>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs">
            <p className="text-[10px] font-semibold text-[#8B7377]">Total Value</p>
            <p className="text-sm font-black text-[#260C13] mt-0.5">
              ₹{(totalContractAmount / 1000).toFixed(0)}k
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs">
            <p className="text-[10px] font-semibold text-emerald-700">Amount Paid</p>
            <p className="text-sm font-black text-emerald-700 mt-0.5">
              ₹{(totalAmountPaid / 1000).toFixed(0)}k
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#EDE0D7] shadow-xs">
            <p className="text-[10px] font-semibold text-rose-700">Balance Due</p>
            <p className="text-sm font-black text-rose-700 mt-0.5">
              ₹{(totalRemainingBalance / 1000).toFixed(0)}k
            </p>
          </div>
        </div>

        {/* Outstanding Invoices List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#260C13] uppercase tracking-wider">
              Active Event Invoices
            </h3>
            <span className="text-[11px] text-[#4B0718] font-bold">
              {myBookings.filter((b) => b.remainingAmount > 0).length} Pending
            </span>
          </div>

          {myBookings.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-dashed border-[#EDE0D7] text-center text-xs text-[#8B7377]">
              No active event invoices.
            </div>
          ) : (
            myBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-3xl bg-white border border-[#EDE0D7] space-y-2 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#260C13]">{b.eventName}</h4>
                    <p className="text-xs text-[#8B7377]">{b.managerName}</p>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      b.remainingAmount === 0
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    {b.remainingAmount === 0 ? 'Fully Paid' : 'Payment Pending'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#EDE0D7]">
                  <span className="text-[#8B7377]">Due Balance:</span>
                  <span className="text-sm font-black text-[#4B0718]">
                    ₹{b.remainingAmount?.toLocaleString('en-IN')}
                  </span>
                </div>

                {b.remainingAmount > 0 && (
                  <button
                    onClick={() => handleOpenCheckout(b)}
                    className="w-full py-2.5 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-98 shadow-xs"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay Now (Razorpay / UPI)</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Payment History List */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-[#260C13] uppercase tracking-wider">
            Payment History & Receipts
          </h3>

          {myPayments.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-dashed border-[#EDE0D7] text-center text-xs text-[#8B7377]">
              No payment transactions recorded yet.
            </div>
          ) : (
            myPayments.map((pay) => (
              <div
                key={pay.id}
                onClick={() => setViewReceipt(pay)}
                className="p-3.5 rounded-2xl bg-white border border-[#EDE0D7] hover:border-[#4B0718]/40 transition cursor-pointer flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#260C13]">{pay.eventName || 'Event Booking'}</h5>
                    <p className="text-[10px] text-[#8B7377] mt-0.5">
                      {pay.paymentMethod || 'UPI'} • Ref: {pay.receiptNo || 'EVX'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-emerald-700">
                    +₹{pay.amount?.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[10px] text-[#8B7377] mt-0.5 flex items-center justify-end gap-1">
                    <Receipt className="w-2.5 h-2.5" /> Receipt
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RAZORPAY / UPI CHECKOUT SIMULATION SHEET */}
        {showCheckout && activeBooking && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
            <div className="w-full max-w-md bg-[#FFF8F3] border border-[#EDE0D7] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
              {/* Modal Header */}
              <div className="p-4 border-b border-[#EDE0D7] flex items-center justify-between bg-[#4B0718] text-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Razorpay Secure Checkout</h3>
                    <p className="text-[10px] text-amber-200/90">EVEX Verified Escrow Simulation</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="p-1 rounded-lg text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              {paymentSuccess ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-[#260C13]">Payment Successful!</h4>
                  <p className="text-xs text-[#8B7377]">
                    ₹{paymentSuccess.amount?.toLocaleString('en-IN')} successfully credited to escrow for{' '}
                    <span className="font-bold text-[#260C13]">{paymentSuccess.eventName}</span>.
                  </p>
                  <div className="p-3 rounded-2xl bg-white border border-[#EDE0D7] text-left text-xs space-y-1">
                    <p className="text-[#8B7377]">
                      Receipt ID: <span className="font-bold text-[#260C13]">{paymentSuccess.receiptNo}</span>
                    </p>
                    <p className="text-[#8B7377]">
                      Method: <span className="font-bold text-[#260C13]">{paymentSuccess.paymentMethod}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="w-full py-2.5 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold transition active:scale-98"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleExecutePayment} className="p-4 space-y-4">
                  {/* Event & Amount Overview */}
                  <div className="p-3.5 rounded-2xl bg-white border border-[#EDE0D7]">
                    <p className="text-[11px] text-[#8B7377]">Paying for Event:</p>
                    <h4 className="font-extrabold text-[#260C13] text-sm">{activeBooking.eventName}</h4>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EDE0D7] text-xs">
                      <span className="text-[#8B7377]">Pending Balance:</span>
                      <span className="font-extrabold text-[#4B0718]">
                        ₹{activeBooking.remainingAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Amount to Pay */}
                  <div>
                    <label className="block text-xs font-bold text-[#260C13] mb-1">
                      Amount to Pay (INR ₹)
                    </label>
                    <div className="relative">
                      <IndianRupee className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8B7377]" />
                      <input
                        type="number"
                        required
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder={activeBooking.remainingAmount?.toString()}
                        className="w-full bg-white border border-[#EDE0D7] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#260C13] focus:outline-none focus:border-[#4B0718] font-bold"
                      />
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <label className="block text-xs font-bold text-[#260C13] mb-2">
                      Select Payment Gateway Method
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          id: 'UPI (Google Pay / PhonePe)',
                          label: 'Instant UPI (Google Pay, PhonePe, Paytm)',
                          sub: 'Zero processing fee • Instant Escrow Lock',
                          icon: Smartphone
                        },
                        {
                          id: 'UPI QR Simulation',
                          label: 'Scan & Pay UPI Dynamic QR',
                          sub: 'Scan with any BHIM / UPI mobile app',
                          icon: QrCode
                        },
                        {
                          id: 'Razorpay Card (Visa / Master / Rupay)',
                          label: 'Razorpay Debit / Credit Card',
                          sub: 'Supports all major Indian banks',
                          icon: CreditCard
                        },
                        {
                          id: 'NetBanking / Corporate NEFT',
                          label: 'Net Banking / NEFT Transfer',
                          sub: 'HDFC, ICICI, SBI, Axis Bank',
                          icon: Building2
                        }
                      ].map((m) => {
                        const Icon = m.icon;
                        const isSelected = paymentMethod === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => setPaymentMethod(m.id)}
                            className={`p-2.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                              isSelected
                                ? 'bg-[#FFF8F3] border-[#4B0718] text-[#260C13]'
                                : 'bg-white border-[#EDE0D7] text-[#8B7377] hover:border-[#4B0718]/40'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                                  isSelected ? 'bg-[#4B0718] text-white' : 'bg-[#FFF8F3] text-[#8B7377]'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[#260C13]">{m.label}</p>
                                <p className="text-[10px] text-[#8B7377]">{m.sub}</p>
                              </div>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#4B0718] bg-[#4B0718]' : 'border-[#EDE0D7]'
                              }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Payment */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white font-bold text-xs shadow-md transition active:scale-98 disabled:opacity-50"
                  >
                    {isProcessing
                      ? 'Processing Escrow...'
                      : `Simulate Payment of ₹${(Number(customAmount) || activeBooking.remainingAmount).toLocaleString('en-IN')}`}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Downloadable / Printable Receipt Modal */}
        <ReceiptModal
          isOpen={Boolean(viewReceipt)}
          onClose={() => setViewReceipt(null)}
          payment={viewReceipt}
          booking={activeBooking}
        />
      </div>
    </div>
  );
};
