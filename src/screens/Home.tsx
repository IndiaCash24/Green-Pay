import { motion } from "motion/react";
import {
  Bell,
  ChevronRight,
  UserCircle2,
  Briefcase,
  CalendarDays,
  Calendar,
  CreditCard,
  FileText,
  Percent,
  HeadphonesIcon,
  ShieldCheck,
  X,
  Megaphone,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useState, useEffect } from "react";

import { type Screen } from "../App";

export default function Home({
  onNotificationClick,
  onNavigate,
}: {
  onNotificationClick: () => void;
  onNavigate: (s: Screen) => void;
}) {
  const { unreadCount, currentUser, userLoan, applyLoan } = useAppContext();
  const [showSecureBanner, setShowSecureBanner] = useState(true);

  const [loanAmount, setLoanAmount] = useState<number>(30000);
  const [loanMonths, setLoanMonths] = useState<number>(12);

  useEffect(() => {
    const limit = currentUser.maxLoanLimit || 100000;
    if (loanAmount > limit) {
      setLoanAmount(limit);
    }
  }, [currentUser.maxLoanLimit, loanAmount]);

  const processingFee = Math.round(loanAmount * 0.03); // 3% processing fee
  const gst = Math.round(processingFee * 0.18); // 18% GST on processing fee
  const netDisbursal = loanAmount - processingFee - gst;

  // 39.2% APR calculation
  const monthlyInterestRate = 0.392 / 12;
  const emi = Math.round(
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanMonths)) /
    (Math.pow(1 + monthlyInterestRate, loanMonths) - 1)
  );
  const totalRepayable = emi * loanMonths;

  const handleApply = () => {
    applyLoan(loanAmount, loanMonths, processingFee, gst, netDisbursal, emi, totalRepayable);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col pb-[100px] bg-[#f9fafb] min-h-screen"
    >
      {/* Header */}
      <div className="bg-[#0b8a40] px-6 pt-12 pb-[70px] rounded-bl-[40px] rounded-br-[40px] relative shadow-sm">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-[13px] text-green-100 flex items-center gap-1 font-medium tracking-wide">
              Good Morning, <span className="text-lg">👋</span>
            </p>
            <h1 className="text-[22px] font-bold mt-0.5 text-white tracking-tight">
              {currentUser.name}
            </h1>
            <p className="text-[12px] text-green-100/90 mt-1 font-medium tracking-wide">
              Welcome back! Manage your finances easily.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onNotificationClick}
              className="relative text-white hover:text-green-200 transition cursor-pointer"
            >
              <Bell size={24} strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0b8a40]"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 z-10 relative space-y-5">
        {(!userLoan || userLoan.status === "none" || userLoan.status === "rejected" || (userLoan.status === "approved" && userLoan.schedule?.every(e => e.status === "paid"))) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[24px] p-6 shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-gray-100"
          >
            {userLoan && userLoan.status === "approved" && userLoan.schedule?.every(e => e.status === "paid") && (
              <div className="mb-4 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                <CheckCircle2 size={18} />
                Previous loan fully paid! You can apply again.
              </div>
            )}
            {userLoan && userLoan.status === "rejected" && (
              <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2">
                <AlertCircle size={18} />
                Previous application rejected. You can apply again.
              </div>
            )}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#f0fdf4] text-[#0b8a40] p-2.5 rounded-[12px]">
                <IndianRupee size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-gray-900 leading-tight">
                  Apply for Loan
                </h2>
                <p className="text-[12px] text-gray-500 mt-0.5 font-medium">
                  Get instant approval for your needs
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[13px] font-bold text-gray-700">
                    Loan Amount
                  </label>
                  <span className="text-[18px] font-bold text-[#0b8a40] bg-green-50 px-3 py-1 rounded-[10px]">
                    ₹ {loanAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max={currentUser.maxLoanLimit || 100000}
                  step="500"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0b8a40]"
                />
                <div className="flex justify-between text-[11px] text-gray-400 font-medium mt-2">
                  <span>₹500</span>
                  <span>₹{((currentUser.maxLoanLimit || 100000) / 1000)}K</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-3">
                  <label className="text-[13px] font-bold text-gray-700">
                    Tenure (Months)
                  </label>
                  <span className="text-[16px] font-bold text-[#0b8a40] bg-green-50 px-3 py-1 rounded-[10px]">
                    {loanMonths} Months
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={loanMonths}
                  onChange={(e) => setLoanMonths(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0b8a40]"
                />
                <div className="flex justify-between text-[11px] text-gray-400 font-medium mt-2">
                  <span>1 Month</span>
                  <span>12 Months</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-[14px] p-4 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[12px] font-medium text-gray-500">Loan Amount</span>
                  <span className="text-[13px] font-bold text-gray-900">₹{loanAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-[12px] font-medium text-gray-500">Processing Fee (3%)</span>
                  <span className="text-[13px] font-bold text-gray-900">₹{processingFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center px-1">
                  <span className="text-[12px] font-medium text-gray-500">GST (18% on PF)</span>
                  <span className="text-[13px] font-bold text-gray-900">₹{gst.toLocaleString("en-IN")}</span>
                </div>
                <div className="border-t border-slate-200 pt-3 mt-1 flex justify-between items-center px-1">
                  <span className="text-[13px] font-bold text-gray-800">Net Disbursal</span>
                  <span className="text-[15px] font-bold text-[#0b8a40]">₹{netDisbursal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center px-1 mt-1">
                   <span className="text-[12px] font-medium text-gray-500">APR (Interest)</span>
                   <span className="text-[13px] font-bold text-gray-900">39.2%</span>
                </div>
                <div className="flex justify-between items-center px-1 mt-1">
                   <span className="text-[12px] font-medium text-gray-500">Total Repayable</span>
                   <span className="text-[13px] font-bold text-gray-900">₹{totalRepayable.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                    Est. EMI
                  </p>
                  <p className="text-[18px] font-bold text-gray-900">
                    ₹{emi.toLocaleString("en-IN")}/mo
                  </p>
                </div>
                <button
                  onClick={handleApply}
                  className="bg-[#0b8a40] text-white font-bold py-3.5 px-8 rounded-[14px] hover:bg-[#0a7a38] active:scale-95 transition shadow-[0_8px_20px_rgb(11,138,64,0.25)] flex items-center gap-2"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {userLoan && userLoan.status === "pending" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[24px] p-6 text-center shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-gray-100"
          >
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-orange-100">
              <Clock className="text-orange-500" size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-[18px] font-bold text-gray-900">
              Application Under Review
            </h2>
            <p className="text-[13px] text-gray-500 mt-2 font-medium leading-relaxed px-4">
              Your loan request for{" "}
              <span className="font-bold text-gray-900">
                ₹{userLoan.amount.toLocaleString("en-IN")}
              </span>{" "}
              over{" "}
              <span className="font-bold text-gray-900">
                {userLoan.durationMonths} months
              </span>{" "}
              is currently pending approval. We will notify you once it's
              processed.
            </p>
          </motion.div>
        )}

        {userLoan && userLoan.status === "rejected" && false && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[24px] p-6 text-center shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-gray-100"
          >
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
              <XCircle className="text-red-500" size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-[18px] font-bold text-gray-900">
              Application Rejected
            </h2>
            <p className="text-[13px] text-gray-500 mt-2 font-medium leading-relaxed px-4">
              Unfortunately, your loan request for{" "}
              <span className="font-bold text-gray-900">
                ₹{userLoan.amount.toLocaleString("en-IN")}
              </span>{" "}
              could not be approved at this time. Please contact support.
            </p>
            <button
              onClick={() => onNavigate("profile")}
              className="mt-6 px-6 py-2 border border-gray-200 rounded-[12px] text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition"
            >
              Contact Support
            </button>
          </motion.div>
        )}

        {userLoan && userLoan.status === "approved" && (!userLoan.schedule || userLoan.schedule.some(e => e.status === "pending")) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="bg-white rounded-[24px] p-6 shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-100 rounded-full blur-[40px] opacity-60 pointer-events-none"></div>

            <div className="flex justify-between items-start relative z-10">
              <div className="flex gap-4">
                <div className="w-14 h-14 bg-[#0b8a40] rounded-2xl flex items-center justify-center text-white shadow-md shadow-green-900/10">
                  <Briefcase size={26} strokeWidth={2} />
                </div>
                <div className="pt-0.5">
                  <p className="text-[14px] font-semibold text-gray-800">
                    Your Loan
                  </p>
                  <div className="bg-green-50 text-[#0b8a40] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] mt-1.5 shadow-sm border border-green-100/50">
                    <span className="w-2 h-2 rounded-full bg-[#0b8a40] animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right pt-0.5">
                <p className="text-[12px] text-gray-500 font-medium">
                  Account No.
                </p>
                <p className="text-[14px] font-bold text-gray-900 mt-1 tracking-widest font-mono">
                  **** {userLoan.id.slice(-4).toUpperCase()}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[16px] border border-slate-100 mt-6 p-4 grid grid-cols-2 gap-y-4 gap-x-2 relative z-10">
              <div>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                  Total Repayable
                </p>
                <p className="text-[17px] font-bold text-gray-900">
                  ₹{userLoan.totalRepayable?.toLocaleString("en-IN") || userLoan.amount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                  Next Due Date
                </p>
                <p className="text-[15px] font-bold text-[#0b8a40] mt-1">
                  {(() => {
                    const nextEmi = userLoan.schedule?.find((emi) => emi.status === "pending");
                    if (nextEmi) {
                      return new Date(nextEmi.dueDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      });
                    }
                    return "Fully Paid";
                  })()}
                </p>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('repayment')}
              className="w-full bg-[#0b8a40] text-white rounded-[16px] py-4.5 mt-5 flex items-center justify-center gap-3 shadow-[0_8px_20px_rgb(11,138,64,0.25)] hover:bg-[#0a7a38] active:scale-[0.98] transition relative z-10 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <div className="bg-white/20 p-1.5 rounded-full ring-2 ring-white/10">
                <CreditCard size={18} strokeWidth={2.5} />
              </div>
              <span className="text-[16px] font-bold tracking-wide">
                Pay EMI - ₹{userLoan.emi?.toLocaleString("en-IN") || 0}
              </span>
            </button>
          </motion.div>
        )}

        {/* Safe & Secure Banner */}
        {showSecureBanner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#f2fdf5] border border-[#dcfce7] rounded-[20px] p-4 flex items-center gap-4 relative overflow-hidden shadow-sm mt-2"
          >
            <button
              onClick={() => setShowSecureBanner(false)}
              className="absolute top-2.5 right-2.5 text-gray-400 bg-black/5 rounded-full p-1 hover:bg-black/10 transition z-20"
            >
              <X size={12} strokeWidth={3} />
            </button>
            <div className="w-12 h-12 bg-[#dcfce7] text-[#0b8a40] rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm relative z-10">
              <ShieldCheck className="fill-[#0b8a40] text-white" size={22} />
            </div>
            <div className="z-10 bg-transparent flex-1 pr-4">
              <h4 className="text-[13px] font-bold text-gray-900 tracking-tight">
                Safe & Secure
              </h4>
              <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                Your data is 100% secure with bank-grade encryption.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
