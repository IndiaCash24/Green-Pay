import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { EMIInstallment, LoanRequest, useAppContext } from '../context/AppContext';

export default function EditLoanScheduleModal({ loan, onClose }: { loan: LoanRequest, onClose: () => void }) {
  const { updateLoanSchedule } = useAppContext();
  const [schedule, setSchedule] = useState<EMIInstallment[]>([]);
  
  useEffect(() => {
    if (loan.schedule) {
      setSchedule(JSON.parse(JSON.stringify(loan.schedule)));
    }
  }, [loan]);

  const handleUpdate = (id: string, field: 'amount' | 'dueDate', value: string) => {
    setSchedule(prev => prev.map(emi => {
      if (emi.id === id) {
        if (field === 'amount') {
           return { ...emi, amount: parseFloat(value) || 0 };
        } else {
           return { ...emi, dueDate: value };
        }
      }
      return emi;
    }));
  };

  const handleSave = () => {
    updateLoanSchedule(loan.id, schedule);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#f9fafb]">
       <div className="flex items-center justify-between bg-white px-5 py-4 shadow-sm relative z-10 shrink-0 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Schedule</h2>
            <p className="text-xs font-medium text-gray-500 uppercase">USER: {loan.userName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
             <X size={24} className="text-gray-500" />
          </button>
       </div>
       
       <div className="flex-1 overflow-y-auto px-5 py-6">
         <div className="bg-blue-50 border border-blue-100 rounded-[14px] p-4 mb-6">
            <h3 className="text-[13px] font-bold text-blue-800 mb-2">Update All Pending Amounts</h3>
            <div className="flex gap-2">
              <input 
                type="number"
                id="bulkAmountInput"
                placeholder="New Amount"
                className="flex-1 bg-white border border-blue-200 rounded-[8px] px-3 py-2 text-[13px] font-semibold text-gray-900 outline-none focus:border-blue-500"
              />
              <button 
                onClick={() => {
                  const val = (document.getElementById('bulkAmountInput') as HTMLInputElement).value;
                  const num = parseFloat(val);
                  if (!isNaN(num)) {
                    setSchedule(prev => prev.map(emi => emi.status === 'pending' ? { ...emi, amount: num } : emi));
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-[8px] font-bold text-[12px] hover:bg-blue-700 transition"
              >
                Apply
              </button>
            </div>
         </div>
       
         <div className="space-y-4">
            {schedule.map((emi, index) => (
               <div key={emi.id} className="bg-white rounded-[16px] p-4 border border-gray-100 shadow-sm">
                 <div className="flex justify-between items-center mb-3">
                   <h3 className="font-bold text-gray-800 text-[14px]">Installment {index + 1}</h3>
                   <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${emi.status === 'paid' ? 'bg-green-100 text-[#0b8a40]' : 'bg-orange-100 text-orange-600'}`}>
                     {emi.status}
                   </span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-3">
                   <div>
                     <label className="text-[11px] font-bold text-gray-500 block mb-1">Due Date</label>
                     <input 
                       type="datetime-local" 
                       value={emi.dueDate ? new Date(new Date(emi.dueDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} 
                       onChange={(e) => handleUpdate(emi.id, 'dueDate', new Date(e.target.value).toISOString())}
                       className="w-full bg-slate-50 border border-slate-200 rounded-[10px] px-3 py-2 text-[13px] font-semibold text-gray-900 outline-none focus:border-[#0b8a40]"
                     />
                   </div>
                   <div>
                     <label className="text-[11px] font-bold text-gray-500 block mb-1">Amount (₹)</label>
                     <input 
                       type="number" 
                       value={emi.amount}
                       onChange={(e) => handleUpdate(emi.id, 'amount', e.target.value)}
                       className="w-full bg-slate-50 border border-slate-200 rounded-[10px] px-3 py-2 text-[13px] font-semibold text-gray-900 outline-none focus:border-[#0b8a40]"
                     />
                   </div>
                 </div>
               </div>
            ))}
         </div>
       </div>
       
       <div className="p-5 bg-white border-t border-gray-100 shrink-0 relative z-10 bottom-0 mb-4 pb-8 sm:pb-5">
          <button 
             onClick={handleSave}
             className="w-full bg-[#0b8a40] text-white py-3.5 rounded-[12px] font-bold text-[15px] flex items-center justify-center space-x-2 shadow-lg hover:bg-[#0a7a38] transition active:scale-[0.98]"
          >
            <Check size={18} />
            <span>Save Changes</span>
          </button>
       </div>
    </div>
  );
}
