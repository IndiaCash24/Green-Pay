import { useState } from "react";
import { motion } from "motion/react";
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  ArrowRight,
  IndianRupee,
  Calendar,
} from "lucide-react";
import { useAppContext, EMIInstallment } from "../context/AppContext";
import { Screen } from "../App";

export default function Repayment({ onBack, onNavigate, onSetPaymentData }: { onBack: () => void, onNavigate: (s: Screen) => void, onSetPaymentData: (data: {loanId: string, emiIds: string[], amount: number}) => void }) {
  const { userLoan, payEMIs } = useAppContext();
  const [selectedEmis, setSelectedEmis] = useState<string[]>([]);

  if (!userLoan || userLoan.status !== "approved" || !userLoan.schedule) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex h-full w-full flex-col bg-[#f9fafb] pb-[100px] min-h-screen relative"
      >
        <div className="bg-[#0b8a40] px-5 pt-12 pb-[60px] rounded-bl-[40px] rounded-br-[40px] relative shadow-sm">
          <div className="flex items-center relative z-10 text-white">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
            >
              <ChevronLeft size={28} />
            </button>
            <div className="ml-2">
              <h1 className="text-[22px] font-bold tracking-tight">
                Repayment
              </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center -mt-8 z-10 px-5 relative h-[300px]">
          <div className="bg-white rounded-[24px] p-8 w-full text-center shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-gray-100">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-100">
              <CheckCircle2
                size={32}
                className="text-gray-300"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-[18px] font-bold text-gray-900">
              No Active Loan
            </h2>
            <p className="text-[13px] text-gray-500 mt-2 font-medium">
              You don't have any active EMI schedule at the moment.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  const pendingEmis = userLoan.schedule.filter((e) => e.status === "pending");
  const nextEmi = pendingEmis.length > 0 ? pendingEmis[0] : null;

  const handleSelectEmi = (id: string) => {
    setSelectedEmis((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handlePayNext = () => {
    if (nextEmi) {
      onSetPaymentData({
        loanId: userLoan.id,
        emiIds: [nextEmi.id],
        amount: nextEmi.amount,
      });
      onNavigate('payment-gateway');
    }
  };

  const handlePaySelected = () => {
    if (selectedEmis.length > 0) {
      onSetPaymentData({
        loanId: userLoan.id,
        emiIds: selectedEmis,
        amount: totalSelectedAmount,
      });
      onNavigate('payment-gateway');
    }
  };

  const totalSelectedAmount = userLoan.schedule
    .filter((e) => selectedEmis.includes(e.id))
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex h-full w-full flex-col bg-[#f9fafb] min-h-screen relative overflow-hidden"
    >
      <div className="bg-[#0b8a40] px-5 pt-12 pb-[70px] rounded-bl-[40px] rounded-br-[40px] relative shadow-sm shrink-0">
        <div className="flex items-center relative z-10 text-white">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="ml-2">
            <h1 className="text-[22px] font-bold tracking-tight">Repayment</h1>
            <p className="text-[13px] text-green-100 font-medium">
              Manage your EMIs
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 -mt-10 z-10 relative pb-[120px] scrollbar-none">
        {/* Top Summary Section */}
        {nextEmi ? (
          <div className="bg-white rounded-[24px] p-6 shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-gray-100 mb-6 transition-all">
            {selectedEmis.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-blue-50 text-blue-500 p-1.5 rounded-full">
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-[14px]">
                    Pay Selected EMIs ({selectedEmis.length})
                  </h3>
                </div>
                <div className="flex justify-between items-end mb-5 bg-slate-50 p-4 rounded-[16px] border border-blue-100">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Total Amount
                    </p>
                    <p className="text-[22px] font-bold text-gray-900 leading-none">
                      ₹{totalSelectedAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePaySelected}
                  className="w-full bg-[#0b8a40] text-white font-bold py-3.5 rounded-[14px] hover:bg-[#0a7a38] active:scale-95 transition shadow-sm flex items-center justify-center gap-2"
                >
                  Pay Total <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-orange-50 text-orange-500 p-1.5 rounded-full">
                    <Calendar size={18} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-[14px]">
                    Next EMI Due
                  </h3>
                </div>

                <div className="flex justify-between items-end mb-5 bg-slate-50 p-4 rounded-[16px] border border-slate-100">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Amount
                    </p>
                    <p className="text-[22px] font-bold text-gray-900 leading-none">
                      ₹{nextEmi.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Due Date
                    </p>
                    <p className="text-[14px] font-bold text-[#0b8a40]">
                      {new Date(nextEmi.dueDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handlePayNext}
                  className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-[14px] hover:bg-slate-800 active:scale-95 transition shadow-sm flex items-center justify-center gap-2"
                >
                  Pay Now <ArrowRight size={18} />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="bg-[#0b8a40] rounded-[24px] p-6 shadow-[0_20px_40px_rgb(0,0,0,0.06)] mb-6 text-center text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-[40px] opacity-10 pointer-events-none"></div>
            <CheckCircle2
              size={40}
              className="mx-auto mb-3 opacity-90"
              strokeWidth={1.5}
            />
            <h3 className="font-bold text-[18px] mb-1 tracking-tight">
              All Caught Up!
            </h3>
            <p className="text-[13px] text-green-100 font-medium">
              You have paid all your EMIs successfully.
            </p>
          </div>
        )}

        {/* Schedule List */}
        <div>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="font-bold text-gray-900 text-[16px]">
              Full Schedule
            </h3>
            <span className="text-[12px] font-bold text-gray-500 bg-gray-200/50 px-2.5 py-1 rounded-full">
              {userLoan.durationMonths} Months
            </span>
          </div>

          <div className="space-y-3">
            {userLoan.schedule.map((emi, index) => {
              const isPaid = emi.status === "paid";
              const isSelected = selectedEmis.includes(emi.id);

              return (
                <div
                  key={emi.id}
                  onClick={() => !isPaid && handleSelectEmi(emi.id)}
                  className={`bg-white rounded-[16px] p-4 border transition-all cursor-pointer flex items-center gap-4 shadow-sm ${
                    isPaid
                      ? "border-gray-100 opacity-60"
                      : isSelected
                        ? "border-[#0b8a40] ring-1 ring-[#0b8a40]/30 shadow-[0_4px_12px_rgb(11,138,64,0.1)]"
                        : "border-white hover:border-gray-200 hover:shadow-md ring-1 ring-gray-100"
                  }`}
                >
                  <div className="shrink-0">
                    {isPaid ? (
                      <CheckCircle2 size={24} className="text-[#0b8a40]" />
                    ) : isSelected ? (
                      <CheckCircle2
                        size={24}
                        className="text-[#0b8a40] fill-green-50"
                      />
                    ) : (
                      <Circle
                        size={24}
                        className="text-gray-300"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-[6px] ${isPaid ? "bg-gray-100 text-gray-500" : "bg-orange-50 text-orange-600"}`}
                      >
                        Month {emi.month}
                      </span>
                      <span
                        className={`text-[12px] font-bold ${isPaid ? "text-gray-500" : "text-gray-700"}`}
                      >
                        {new Date(emi.dueDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`font-bold ${isPaid ? "text-gray-500" : "text-gray-900"} text-[16px]`}
                      >
                        ₹{emi.amount.toLocaleString("en-IN")}
                      </span>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${isPaid ? "text-[#0b8a40]" : "text-gray-400"}`}
                      >
                        {isPaid ? "Paid" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
