import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LogOut,
  Users,
  FileText,
  CheckCircle,
  Search,
  Clock,
  ShieldCheck,
  IndianRupee,
  Layers,
  XCircle,
  Edit3,
} from "lucide-react";
import { useAppContext, EMIInstallment, LoanRequest } from "../context/AppContext";
import EditLoanScheduleModal from "./EditLoanScheduleModal";

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const {
    totalUsers,
    paymentRequests,
    approvePayment,
    rejectPayment,
    loanRequests,
    approveLoan,
    rejectLoan,
    updateLoan,
    sendNotificationToUser,
    appSettings,
    updateAppSettings,
    users,
    updateUserLimit,
  } = useAppContext();
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [activeTab, setActiveTab] = useState<"loans" | "payments" | "users" | "settings">("loans");
  const [editingLoanId, setEditingLoanId] = useState<string | null>(null);
  const [editingUserLoanId, setEditingUserLoanId] = useState<string | null>(null);
  const [qrUrlInput, setQrUrlInput] = useState<string>(appSettings?.qrImageUrl || "");

  React.useEffect(() => {
    setQrUrlInput(appSettings?.qrImageUrl || "");
  }, [appSettings?.qrImageUrl]);

  const filteredPayments = paymentRequests.filter(
    (req) => filter === "all" || req.status === filter,
  );
  const filteredLoans = loanRequests.filter(
    (req) => filter === "all" || req.status === filter,
  );

  const pendingPaymentsCount = paymentRequests.filter(
    (r) => r.status === "pending",
  ).length;
  const pendingLoansCount = loanRequests.filter(
    (r) => r.status === "pending",
  ).length;

  const totalPending = pendingPaymentsCount + pendingLoansCount;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full w-full flex-col bg-slate-50 relative pb-6"
    >
      <div className="bg-slate-900 px-6 pt-12 pb-8 rounded-b-[40px] text-white shadow-lg z-10 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="rounded-xl bg-blue-500/20 p-2 backdrop-blur-md ring-1 ring-white/10">
              <ShieldCheck size={28} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Admin Portal</p>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="rounded-full bg-white/10 p-2.5 backdrop-blur-md ring-1 ring-white/20 hover:bg-white/20 transition"
          >
            <LogOut size={20} className="text-white" />
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-blue-300 mb-2">
              <Users size={18} />
              <span className="text-sm font-semibold">Total Users</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {totalUsers.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm relative overflow-hidden">
            {totalPending > 0 && (
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
            )}
            <div className="flex items-center space-x-2 text-orange-300 mb-2">
              <Layers size={18} />
              <span className="text-sm font-semibold">Total Pending</span>
            </div>
            <p className="text-3xl font-bold text-white">{totalPending}</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 flex-1 flex flex-col z-10 min-h-0">
        {/* Main Tabs */}
        <div className="flex bg-white p-1 rounded-[16px] border border-slate-200 mb-5">
          <button
            onClick={() => setActiveTab("loans")}
            className={`flex-1 py-2.5 text-[14px] font-bold rounded-[12px] transition ${activeTab === "loans" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Loan Applications{" "}
            {pendingLoansCount > 0 && (
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${activeTab === "loans" ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}
              >
                {pendingLoansCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`flex-1 py-2.5 text-[14px] font-bold rounded-[12px] transition ${activeTab === "payments" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            EMI Payments{" "}
            {pendingPaymentsCount > 0 && (
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] ${activeTab === "payments" ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}
              >
                {pendingPaymentsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-2.5 text-[14px] font-bold rounded-[12px] transition ${activeTab === "settings" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 py-2.5 text-[14px] font-bold rounded-[12px] transition ${activeTab === "users" ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Users
          </button>
        </div>

        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
          {(activeTab !== "settings" && activeTab !== "users") && (
            (["pending", "approved", "rejected", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-[10px] px-4 py-1.5 text-sm font-bold whitespace-nowrap transition border ${
                  filter === f
                    ? "bg-slate-100 text-slate-800 border-slate-200 shadow-sm"
                    : "bg-white text-slate-500 border-transparent hover:bg-slate-50"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + filter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-3"
            >
              {activeTab === "settings" ? (
                <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/50">
                  <h3 className="font-bold text-slate-900 mb-4 text-[16px]">Payment Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[12px] font-bold text-slate-600 block mb-1">UPI QR Code Image URL</label>
                      <input 
                        type="url" 
                        value={qrUrlInput}
                        onChange={(e) => setQrUrlInput(e.target.value)}
                        placeholder="https://example.com/qr-code.png"
                        className="w-full bg-slate-50 border border-slate-200 rounded-[12px] px-3 py-2.5 text-[14px] font-medium text-slate-800 outline-none focus:border-[#0b8a40] transition"
                      />
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                        Provide a direct link to the QR code image. This will be shown to users when they are making a payment.
                      </p>
                    </div>
                    {qrUrlInput && (
                      <div className="bg-slate-50 border border-slate-200 rounded-[12px] p-3 w-40 h-40 mx-auto flex items-center justify-center relative shadow-inner">
                         <img src={qrUrlInput} alt="Preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <button
                      onClick={() => {
                        updateAppSettings({ qrImageUrl: qrUrlInput });
                        alert("Settings updated successfully!");
                      }}
                      className="w-full bg-[#0b8a40] text-white py-3 rounded-[12px] font-bold text-[14px] shadow-[0_4px_10px_rgb(11,138,64,0.2)] hover:bg-[#0a7a38] transition active:scale-[0.98]"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              ) : activeTab === "users" ? (
                <div className="space-y-4">
                  {users.map(user => {
                    const userLoans = loanRequests.filter(l => l.userId === user.id);
                    const activeUserLoan = userLoans.find(l => l.status === "pending" || (l.status === "approved" && l.schedule?.some(emi => emi.status === "pending")));
                    const currentLoan = activeUserLoan || userLoans[userLoans.length - 1];

                    return (
                    <div key={user.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col space-y-3">
                       <div className="flex justify-between items-start">
                          <div>
                             <h4 className="font-bold text-slate-800 text-[15px]">{user.name}</h4>
                             <p className="text-slate-500 text-[12px]">{user.email}</p>
                          </div>
                       </div>
                       <div className="pt-2 border-t border-slate-50 flex flex-col gap-2">
                          <label className="text-[11px] font-bold text-slate-500">Max Loan Limit Offer (₹)</label>
                          <div className="flex gap-2">
                             <input 
                                type="number" 
                                defaultValue={user.maxLoanLimit || ""}
                                placeholder="Enter max limit"
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-[10px] px-3 py-2 text-[13px] font-semibold text-gray-900 outline-none focus:border-[#0b8a40]"
                                id={`limit-input-${user.id}`}
                             />
                             <button
                                onClick={() => {
                                   const input = document.getElementById(`limit-input-${user.id}`) as HTMLInputElement;
                                   const limit = parseFloat(input.value);
                                   if (!isNaN(limit)) {
                                      updateUserLimit(user.id, limit);
                                      alert("Limit updated successfully!");
                                   }
                                }}
                                className="bg-slate-900 text-white px-4 py-2 rounded-[10px] text-[12px] font-bold hover:bg-slate-800 transition"
                             >
                               Save
                             </button>
                          </div>
                       </div>
                       
                       {currentLoan && !editingUserLoanId && (
                           <div className="pt-2 border-t border-slate-50">
                              <button
                                 onClick={() => setEditingUserLoanId(currentLoan.id)}
                                 className="w-full bg-blue-50 text-blue-600 font-bold py-2 rounded-[10px] text-[12px] hover:bg-blue-100 transition"
                               >
                                 Edit Loan Details (₹{currentLoan.amount})
                              </button>
                           </div>
                       )}

                       {currentLoan && editingUserLoanId === currentLoan.id && (
                           <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
                               <p className="text-[13px] font-bold text-slate-800 mb-1">Edit Loan Details</p>
                               <div className="grid grid-cols-2 gap-3">
                                   <div>
                                       <label className="text-[10px] font-bold text-slate-500 uppercase">Amount</label>
                                       <input type="number" id={`edit-loan-amount-${currentLoan.id}`} defaultValue={currentLoan.amount} className="w-full bg-slate-50 border border-slate-200 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-gray-900 outline-none focus:border-[#0b8a40]" />
                                   </div>
                                   <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Months</label>
                                        <input type="number" id={`edit-loan-months-${currentLoan.id}`} defaultValue={currentLoan.durationMonths} className="w-full bg-slate-50 border border-slate-200 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-gray-900 outline-none focus:border-[#0b8a40]" />
                                   </div>
                                   <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Processing Fee</label>
                                        <input type="number" id={`edit-loan-pf-${currentLoan.id}`} defaultValue={currentLoan.processingFee || Math.round(currentLoan.amount * 0.03)} className="w-full bg-slate-50 border border-slate-200 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-gray-900 outline-none focus:border-[#0b8a40]" />
                                   </div>
                                   <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">GST</label>
                                        <input type="number" id={`edit-loan-gst-${currentLoan.id}`} defaultValue={currentLoan.gst || Math.round(Math.round(currentLoan.amount * 0.03) * 0.18)} className="w-full bg-slate-50 border border-slate-200 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-gray-900 outline-none focus:border-[#0b8a40]" />
                                   </div>
                                   <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Net Disbursal</label>
                                        <input type="number" id={`edit-loan-net-${currentLoan.id}`} defaultValue={currentLoan.netDisbursal} className="w-full bg-slate-50 border border-slate-200 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-gray-900 outline-none focus:border-[#0b8a40]" />
                                   </div>
                                   <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">EMI</label>
                                        <input type="number" id={`edit-loan-emi-${currentLoan.id}`} defaultValue={currentLoan.emi} className="w-full bg-slate-50 border border-slate-200 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-gray-900 outline-none focus:border-[#0b8a40]" />
                                   </div>
                                   <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase">Total Repayable</label>
                                        <input type="number" id={`edit-loan-total-${currentLoan.id}`} defaultValue={currentLoan.totalRepayable || (currentLoan.emi * currentLoan.durationMonths)} className="w-full bg-slate-50 border border-slate-200 rounded-[8px] px-3 py-1.5 text-[12px] font-semibold text-gray-900 outline-none focus:border-[#0b8a40]" />
                                   </div>
                               </div>
                               <div className="flex gap-2 mt-2">
                                   <button
                                     onClick={() => {
                                        const amount = parseFloat((document.getElementById(`edit-loan-amount-${currentLoan.id}`) as HTMLInputElement).value);
                                        const durationMonths = parseFloat((document.getElementById(`edit-loan-months-${currentLoan.id}`) as HTMLInputElement).value);
                                        const processingFee = parseFloat((document.getElementById(`edit-loan-pf-${currentLoan.id}`) as HTMLInputElement).value);
                                        const gst = parseFloat((document.getElementById(`edit-loan-gst-${currentLoan.id}`) as HTMLInputElement).value);
                                        const netDisbursal = parseFloat((document.getElementById(`edit-loan-net-${currentLoan.id}`) as HTMLInputElement).value);
                                        const emi = parseFloat((document.getElementById(`edit-loan-emi-${currentLoan.id}`) as HTMLInputElement).value);
                                        const totalRepayable = parseFloat((document.getElementById(`edit-loan-total-${currentLoan.id}`) as HTMLInputElement).value);
                                        
                                        updateLoan(currentLoan.id, {
                                            amount, durationMonths, processingFee, gst, netDisbursal, emi, totalRepayable
                                        });
                                        sendNotificationToUser(currentLoan.userId, {
                                          title: "Loan Details Updated",
                                          message: "Your loan details have been updated by the admin.",
                                          date: new Date().toISOString(),
                                          read: false
                                        });
                                        setEditingUserLoanId(null);
                                        alert("Loan details updated successfully!");
                                     }}
                                     className="flex-1 bg-[#0b8a40] text-white py-2 rounded-[10px] text-[12px] font-bold hover:bg-[#0a7a38] transition"
                                   >
                                      Save details
                                   </button>
                                   <button
                                     onClick={() => setEditingUserLoanId(null)}
                                     className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-[10px] text-[12px] font-bold hover:bg-slate-200 transition"
                                   >
                                      Cancel
                                   </button>
                               </div>
                           </div>
                       )}
                    </div>
                  )})}
                  {users.length === 0 && (
                     <div className="text-center py-10 text-slate-500 text-[14px]">
                        No users found.
                     </div>
                  )}
                </div>
              ) : activeTab === "loans" ? (
                filteredLoans.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-slate-100 border-dashed border-2">
                    <Search size={48} className="text-slate-300 mb-4" />
                    <p className="text-slate-500 font-semibold">
                      No loan requests found
                    </p>
                  </div>
                ) : (
                  filteredLoans.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/50 flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-slate-900">
                            {req.userName}
                          </h3>
                          <p className="text-[11px] font-semibold text-slate-500 flex items-center mt-0.5 uppercase tracking-wider">
                            USER ID: {req.userId}
                          </p>
                        </div>
                        <div
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-[8px] uppercase tracking-wider ${
                            req.status === "pending"
                              ? "bg-orange-50 text-orange-600 border border-orange-100"
                              : req.status === "approved"
                                ? "bg-green-50 text-green-600 border border-green-100"
                                : "bg-red-50 text-red-600 border border-red-100"
                          }`}
                        >
                          {req.status}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                            Loan Request (Amount)
                          </p>
                          <p className="text-[17px] font-bold text-slate-800">
                            ₹{req.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                            Tenure
                          </p>
                          <p className="text-[14px] font-bold text-slate-700 flex items-center justify-end">
                            <Clock
                              size={14}
                              className="mr-1.5 text-slate-400"
                            />
                            {req.durationMonths} Months
                          </p>
                        </div>
                      </div>

                      {req.status === "pending" && (
                        <div className="flex space-x-3 mt-auto">
                          <button
                            onClick={() => approveLoan(req.id)}
                            className="flex-1 flex items-center justify-center space-x-1.5 rounded-[12px] bg-[#0b8a40] py-2.5 font-bold text-white transition hover:bg-[#0a7a38] active:scale-[0.98] shadow-[0_4px_10px_rgb(11,138,64,0.2)]"
                          >
                            <CheckCircle size={18} />
                            <span>Approve Loan</span>
                          </button>
                          <button
                            onClick={() => rejectLoan(req.id)}
                            className="flex-1 flex items-center justify-center space-x-1.5 rounded-[12px] bg-red-50 py-2.5 font-bold text-red-600 transition hover:bg-red-100 border border-red-100 active:scale-[0.98]"
                          >
                            <XCircle size={18} />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                      {req.status === "approved" && (
                        <div className="flex space-x-3 mt-auto pt-2 border-t border-slate-100">
                          <button
                            onClick={() => setEditingLoanId(req.id)}
                            className="flex-1 flex items-center justify-center space-x-1.5 rounded-[12px] bg-slate-100 py-2.5 font-bold text-slate-700 transition hover:bg-slate-200 active:scale-[0.98]"
                          >
                            <Edit3 size={18} />
                            <span>Manage Schedule</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )
              ) : filteredPayments.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-slate-100 border-dashed border-2">
                  <Search size={48} className="text-slate-300 mb-4" />
                  <p className="text-slate-500 font-semibold">
                    No payment requests found
                  </p>
                </div>
              ) : (
                filteredPayments.map((req) => (
                  <div
                    key={req.id}
                    className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/50 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {req.userName}
                        </h3>
                        <p className="text-[11px] font-semibold text-slate-500 flex items-center mt-0.5 uppercase tracking-wider">
                          USER ID: {req.userId}
                        </p>
                      </div>
                      <div
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-[8px] uppercase tracking-wider ${
                          req.status === "pending"
                            ? "bg-orange-50 text-orange-600 border border-orange-100"
                            : req.status === "approved"
                              ? "bg-green-50 text-green-600 border border-green-100"
                              : "bg-red-50 text-red-600 border border-red-100"
                        }`}
                      >
                        {req.status}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                          Amount
                        </p>
                        <p className="text-[17px] font-bold text-slate-800">
                          ₹{req.amount?.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                          UTR Number
                        </p>
                        <p className="text-[14px] font-bold text-indigo-600 tracking-wider">
                          {req.utr}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-left">
                        <p className="text-[11px] font-semibold text-slate-500 mb-0.5">
                          Payment Date
                        </p>
                        <p className="text-[13px] font-bold text-slate-700 flex items-center">
                          <Clock size={12} className="mr-1.5 text-slate-400" />
                          {new Date(req.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {req.status === "pending" && (
                      <div className="flex space-x-3 mt-auto">
                        <button
                          onClick={() => approvePayment(req.id, req)}
                          className="flex-1 flex items-center justify-center space-x-1.5 rounded-[12px] bg-[#0b8a40] py-2.5 font-bold text-white transition hover:bg-[#0a7a38] active:scale-[0.98] shadow-[0_4px_10px_rgb(11,138,64,0.2)]"
                        >
                          <CheckCircle size={18} />
                          <span>Verify</span>
                        </button>
                        <button
                          onClick={() => rejectPayment(req.id, req)}
                          className="flex-1 flex items-center justify-center space-x-1.5 rounded-[12px] bg-red-50 py-2.5 font-bold text-red-600 transition hover:bg-red-100 border border-red-100 active:scale-[0.98]"
                        >
                          <XCircle size={18} />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
         {editingLoanId && (
            <motion.div 
               initial={{ opacity: 0, y: 100 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 100 }}
               className="absolute inset-0 z-50 overflow-hidden rounded-b-[40px] sm:rounded-[40px] bg-white flex flex-col"
            >
               <EditLoanScheduleModal 
                  loan={loanRequests.find(l => l.id === editingLoanId)!} 
                  onClose={() => setEditingLoanId(null)} 
               />
            </motion.div>
         )}
      </AnimatePresence>
    </motion.div>
  );
}
