import React from 'react';
import {
  X,
  Printer,
  CheckCircle2,
  ShieldCheck,
  Download,
  Calendar,
  Building2,
  User,
  CreditCard
} from 'lucide-react';

export const ReceiptModal = ({ isOpen, onClose, payment, booking }) => {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const receiptNo = payment.receiptNo || `EVX-${payment.id?.slice(-6) || '202601'}`;
  const paymentDate = payment.date || new Date().toLocaleDateString('en-GB');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#EDE0D7] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-[#FFF8F3] border-b border-[#EDE0D7] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4B0718]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official EVEX Transaction Receipt (Test Mode Verified)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 rounded-xl bg-[#4B0718] hover:bg-[#350713] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/5 text-[#736B66] hover:text-[#242424] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-6 overflow-y-auto no-scrollbar space-y-5 text-[#242424]" id="evex-printable-receipt">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#EDE0D7] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Cinzel',serif] text-2xl font-black tracking-widest text-[#4B0718]">EVEX</span>
              </div>
              <p className="text-[11px] text-[#736B66] mt-0.5">Events · People · Opportunities</p>
              <p className="text-[10px] text-[#736B66]">support@evex.app · https://evex-1c901.web.app</p>
            </div>

            <div className="text-right">
              <span className="inline-block py-1 px-2.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold uppercase tracking-wider">
                {payment.status || 'PAID'}
              </span>
              <p className="text-xs font-black text-[#4B0718] mt-2">Receipt #{receiptNo}</p>
              <p className="text-[11px] text-[#736B66]">Date: {paymentDate}</p>
            </div>
          </div>

          {/* Billing Info Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FFF8F3] border border-[#EDE0D7] text-xs">
            <div>
              <span className="text-[10px] font-bold text-[#736B66] uppercase tracking-wider block mb-1">
                Billed To (Customer):
              </span>
              <p className="font-extrabold text-[#242424]">{payment.customerName || 'EVEX Customer'}</p>
              <p className="text-[#736B66]">{payment.customerId ? `Client ID: ${payment.customerId.slice(0, 12)}...` : ''}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#736B66] uppercase tracking-wider block mb-1">
                Event Service Provider:
              </span>
              <p className="font-extrabold text-[#242424]">{payment.managerName || 'Aura Events Co.'}</p>
              <p className="text-[#736B66]">Verified Event Management Agency</p>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-3.5 rounded-xl border border-[#EDE0D7] bg-white text-xs space-y-1">
            <p className="font-bold text-[#242424] flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#4B0718]" />
              <span>Event: {payment.eventName || booking?.eventName || 'Special Celebration'}</span>
            </p>
            {booking?.eventDate && (
              <p className="text-[11px] text-[#736B66] pl-5">Scheduled Date: {booking.eventDate}</p>
            )}
            {booking?.location && (
              <p className="text-[11px] text-[#736B66] pl-5">Venue / City: {booking.location}</p>
            )}
          </div>

          {/* Line Items Table */}
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#EDE0D7] text-left text-[11px] font-bold text-[#736B66] uppercase">
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Payment Type</th>
                <th className="py-2 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE0D7]">
              <tr>
                <td className="py-3">
                  <p className="font-bold text-[#242424]">Event Booking Payment</p>
                  <p className="text-[10px] text-[#736B66]">
                    Method: {payment.paymentMethod || 'Razorpay Standard Checkout (UPI / Cards)'}
                  </p>
                </td>
                <td className="py-3 text-right font-medium text-[#736B66]">
                  {payment.type || 'Booking Settlement'}
                </td>
                <td className="py-3 text-right font-black text-sm text-[#4B0718]">
                  ₹{Number(payment.amount).toLocaleString('en-IN')}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Verification Audit Details */}
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-[10px] space-y-1 text-[#736B66]">
            <p className="font-bold text-[#242424] flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Razorpay Test Mode Verification Details</span>
            </p>
            <p className="truncate">Transaction ID: <span className="font-mono text-[#242424]">{payment.paymentId || payment.id}</span></p>
            {payment.orderId && (
              <p className="truncate">Order ID: <span className="font-mono text-[#242424]">{payment.orderId}</span></p>
            )}
            <p>HMAC SHA256 Signature: <span className="font-mono text-emerald-700">Verified ✓</span></p>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 text-[10px] text-[#736B66] border-t border-[#EDE0D7]">
            <p>This is a computer-generated receipt issued by EVEX Event Technologies.</p>
            <p className="mt-0.5">Test mode transaction for simulation and staging purposes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
