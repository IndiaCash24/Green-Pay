import { motion } from "motion/react";
import {
  ArrowLeft,
  FileText,
  IndianRupee,
  Calendar,
  Percent,
  TrendingUp,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function MyLoanDetails({ onBack }: { onBack: () => void }) {
  const { loanRequests, currentUser } = useAppContext();
  
  const userLoans = loanRequests.filter((l) => l.userId === currentUser.id);
  const activeUserLoan = userLoans.find(l => l.status === "pending" || (l.status === "approved" && l.schedule?.some(emi => emi.status === "pending")));
  const userLoan = activeUserLoan || userLoans[userLoans.length - 1];

  if (!userLoan) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex h-full flex-col bg-slate-50"
      >
        <div className="flex items-center space-x-4 bg-white px-5 py-4 shadow-sm relative z-10">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition active:scale-95"
          >
            <ArrowLeft size={24} className="text-slate-700" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Loan Details</h1>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 max-w-sm w-full mx-auto">
            <Receipt className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-[18px] font-bold text-slate-800 mb-2">No Active Loans</h2>
            <p className="text-[14px] text-slate-500 font-medium">You haven't applied for any loans yet.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const processingFee = userLoan.processingFee || Math.round(userLoan.amount * 0.03);
  const gst = userLoan.gst || Math.round(processingFee * 0.18);
  const totalRepayable = userLoan.totalRepayable || (userLoan.emi * userLoan.durationMonths);
  const statusColors = {
    pending: "bg-orange-100 text-orange-600",
    approved: "bg-[#0b8a40]/10 text-[#0b8a40]",
    rejected: "bg-red-100 text-red-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full flex-col bg-slate-50"
    >
      <div className="flex items-center space-x-4 bg-white px-5 py-4 shadow-sm relative z-10 shrink-0 border-b border-slate-100">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition active:scale-95 text-slate-500"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h1 className="text-[20px] font-extrabold text-slate-900 tracking-tight">My Loan Details</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-3 rounded-2xl">
                <FileText size={24} className="text-slate-600" />
              </div>
              <div>
                <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">Loan ID</p>
                <p className="text-[15px] font-bold text-slate-800">
                  {userLoan.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-[10px] text-[12px] font-bold uppercase tracking-wide ${statusColors[userLoan.status as keyof typeof statusColors] || "bg-slate-100 text-slate-600"}`}>
               {userLoan.status}
            </span>
          </div>

          <div className="mb-6 bg-slate-50 border border-slate-100 p-4 rounded-[16px] text-center">
             <p className="text-[13px] font-semibold text-slate-500 mb-1">Total Loan Amount</p>
             <h2 className="text-[32px] font-black text-slate-900 tracking-tight flex items-center justify-center gap-1">
                <IndianRupee size={28} strokeWidth={3} />
                {userLoan.amount.toLocaleString("en-IN")}
             </h2>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
               <div className="flex items-center gap-2 text-slate-600">
                 <Calendar size={18} />
                 <span className="text-[14px] font-medium">Duration</span>
               </div>
               <span className="text-[15px] font-bold text-slate-800">{userLoan.durationMonths} Months</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
               <div className="flex items-center gap-2 text-slate-600">
                 <Percent size={18} />
                 <span className="text-[14px] font-medium">Interest Rate</span>
               </div>
               <span className="text-[15px] font-bold text-slate-800">2% p.m.</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
               <div className="flex items-center gap-2 text-slate-600">
                 <ArrowLeft size={18} className="rotate-180" />
                 <span className="text-[14px] font-medium">Processing Fee (3%)</span>
               </div>
               <span className="text-[15px] font-bold text-red-500">-₹{processingFee.toLocaleString("en-IN")}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
               <div className="flex items-center gap-2 text-slate-600">
                 <Receipt size={18} />
                 <span className="text-[14px] font-medium">GST on Fee (18%)</span>
               </div>
               <span className="text-[15px] font-bold text-red-500">-₹{gst.toLocaleString("en-IN")}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-slate-50">
               <div className="flex items-center gap-2 text-[#0b8a40]">
                 <TrendingUp size={18} />
                 <span className="text-[14px] font-bold">Net Disbursal</span>
               </div>
               <span className="text-[16px] font-black text-[#0b8a40]">₹{userLoan.netDisbursal.toLocaleString("en-IN")}</span>
             </div>
             <div className="flex justify-between items-center py-2 border-slate-50 pt-2">
               <div className="flex items-center gap-2 text-slate-900">
                 <IndianRupee size={18} />
                 <span className="text-[14px] font-bold">Total Repayable</span>
               </div>
               <span className="text-[18px] font-black text-slate-900 flex items-center">
                 ₹{totalRepayable.toLocaleString("en-IN")}
               </span>
             </div>
             <div className="flex justify-between items-center py-2">
               <div className="flex items-center gap-2 text-slate-500">
                 <span className="text-[14px] font-medium ml-6">Monthly EMI</span>
               </div>
               <span className="text-[15px] font-bold text-slate-600">
                 ₹{userLoan.emi.toLocaleString("en-IN")}/mo
               </span>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
