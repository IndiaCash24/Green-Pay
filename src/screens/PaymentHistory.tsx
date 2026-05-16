import { motion } from 'motion/react';
import { ChevronLeft, Receipt, CalendarClock, IndianRupee } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function PaymentHistory({ onBack }: { onBack: () => void }) {
  const { paymentHistory, currentUser } = useAppContext();

  // Filter for actual transactions by this user
  const myHistory = paymentHistory
    .filter(p => p.userId === currentUser.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex h-full w-full flex-col bg-[#f9fafb] relative overflow-hidden"
    >
      <div className="bg-[#0b8a40] px-5 pt-12 pb-[60px] rounded-bl-[40px] rounded-br-[40px] relative shadow-sm shrink-0">
        <div className="flex items-center relative z-10 text-white">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="ml-2">
            <h1 className="text-[22px] font-bold tracking-tight">Payment History</h1>
            <p className="text-[13px] text-green-100 font-medium">Your recent transactions</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 -mt-8 z-10 relative pb-[120px] scrollbar-none">
        {myHistory.length === 0 ? (
           <div className="bg-white rounded-[24px] p-8 w-full text-center shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-gray-100">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-100">
               <Receipt size={32} className="text-gray-300" strokeWidth={1.5} />
             </div>
             <h2 className="text-[18px] font-bold text-gray-900">No Transactions</h2>
             <p className="text-[13px] text-gray-500 mt-2 font-medium">You don't have any payment history yet.</p>
           </div>
        ) : (
          <div className="space-y-4">
             {myHistory.map((item) => (
                <div key={item.id} className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                            <IndianRupee size={18} className="text-[#0b8a40]" />
                         </div>
                         <div>
                            <p className="text-[15px] font-bold text-gray-900 leading-tight">EMI Payment</p>
                            <p className="text-[12px] font-medium text-gray-500">{item.emiIds.length} Installment{item.emiIds.length > 1 ? 's' : ''}</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[16px] font-bold text-[#0b8a40]">₹{item.amount.toLocaleString('en-IN')}</p>
                         <p className="text-[11px] font-bold text-gray-400 uppercase">Paid</p>
                      </div>
                   </div>
                   
                   <div className="border-t border-gray-50 pt-3 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                         <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">Date & Time</p>
                         <p className="text-[12px] font-semibold text-gray-700 flex items-center gap-1">
                            <CalendarClock size={12} className="text-gray-400" />
                            {new Date(item.date).toLocaleString('en-IN', {
                               day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                         </p>
                      </div>
                      <div className="flex items-center justify-between">
                         <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">UTR Number</p>
                         <p className="text-[12px] font-mono font-bold tracking-wider text-gray-800">{item.utr}</p>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
