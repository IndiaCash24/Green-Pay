import React from 'react';
import { motion } from 'motion/react';
import { 
  Bell,
  HeadphonesIcon,
  BadgeCheck,
  ChevronRight,
  Shield,
  User as UserIcon,
  Building2,
  FileText,
  BadgePercent,
  History,
  Briefcase,
  HelpCircle,
  Settings,
  Lock,
  LogOut,
  ShieldAlert,
  Wallet,
  CalendarDays
} from 'lucide-react';
import { type Screen } from '../App';
import { useAppContext } from '../context/AppContext';

export default function Profile({ onLogout, onNavigate }: { onLogout: () => void, onNavigate: (s: Screen) => void }) {
  const { unreadCount, currentUser } = useAppContext();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col pb-6 bg-[#f9fafb] min-h-full"
    >
      {/* Header */}
      <div className="bg-[#0b8a40] px-5 pt-12 pb-[90px] rounded-bl-[40px] rounded-br-[40px] relative shadow-sm">
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h1 className="text-[22px] font-bold text-white tracking-tight">More</h1>
            <p className="text-[12px] text-green-100 mt-0.5 tracking-wide leading-snug pr-4">Manage your profile, settings and more</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={() => onNavigate('notifications')}
               className="relative text-white hover:text-green-100 transition cursor-pointer"
             >
               <Bell size={24} strokeWidth={2} />
               {unreadCount > 0 && (
                 <span className="absolute top-0.5 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0b8a40]"></span>
               )}
             </button>
             <button className="text-white hover:text-green-100 transition cursor-pointer">
               <HeadphonesIcon size={24} strokeWidth={2} />
             </button>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-16 z-10 relative space-y-4">
        
        {/* User Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-between cursor-pointer hover:border-green-200 transition">
           <div className="flex items-center gap-4">
              <div className="relative">
                 <div className="w-[60px] h-[60px] bg-[#e5e7eb] rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm text-gray-400">
                    <UserIcon size={36} className="mt-2" strokeWidth={1.5} />
                 </div>
                 <div className="absolute bottom-0 right-0 w-[20px] h-[20px] bg-[#0b8a40] rounded-full border-2 border-white flex items-center justify-center text-white">
                    <BadgeCheck size={12} strokeWidth={3} />
                 </div>
              </div>
              <div>
                 <h2 className="text-[17px] font-bold text-gray-900 truncate max-w-[200px]">{currentUser.name}</h2>
                 <p className="text-[12px] font-medium text-gray-500 truncate max-w-[200px]">{currentUser.email}</p>
                 <div className="mt-1.5 inline-flex items-center gap-1 bg-[#f0fdf4] text-[#0b8a40] px-2 py-0.5 rounded-[6px] border border-[#dcfce7]">
                    <BadgeCheck size={12} strokeWidth={3} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                 </div>
              </div>
           </div>
           <ChevronRight size={20} className="text-gray-400" />
        </div>

        {/* Actions List */}
        <div className="pt-2 space-y-4">
           <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden divide-y divide-gray-50">
             
             <button 
                onClick={() => onNavigate('notifications')}
                className="w-full flex items-center justify-between p-4.5 cursor-pointer hover:bg-[#f0fdf4] transition"
             >
                <div className="flex items-center gap-4">
                   <div className="bg-green-50 text-[#0b8a40] w-12 h-12 flex items-center justify-center rounded-[14px]">
                      <Bell size={24} strokeWidth={2} />
                   </div>
                   <div className="text-left">
                      <p className="text-[15px] font-bold text-gray-900">Notifications</p>
                      <p className="text-[13px] font-medium text-gray-500 mt-0.5">View your alerts and updates</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   {unreadCount > 0 && <span className="bg-red-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">{unreadCount}</span>}
                   <ChevronRight size={20} className="text-gray-400" />
                </div>
             </button>

             <button 
                onClick={() => onNavigate('payment-history')}
                className="w-full flex items-center justify-between p-4.5 cursor-pointer hover:bg-green-50 transition"
             >
                <div className="flex items-center gap-4">
                   <div className="bg-green-50 text-green-600 w-12 h-12 flex items-center justify-center rounded-[14px]">
                      <History size={24} strokeWidth={2} />
                   </div>
                   <div className="text-left">
                      <p className="text-[15px] font-bold text-gray-900">Payment History</p>
                      <p className="text-[13px] font-medium text-gray-500 mt-0.5">View your past transactions and UTR</p>
                   </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
             </button>

             {currentUser.email === 'surendrabusiness02@gmail.com' && (
                <div 
                   onClick={() => onNavigate('admin')}
                   className="w-full flex items-center justify-between p-4.5 cursor-pointer hover:bg-slate-50 transition"
                >
                   <div className="flex items-center gap-4">
                      <div className="bg-slate-100 text-slate-700 w-12 h-12 flex items-center justify-center rounded-[14px]">
                         <ShieldAlert size={24} strokeWidth={2} />
                      </div>
                      <div className="text-left">
                         <p className="text-[15px] font-bold text-slate-900">Admin Portal</p>
                         <p className="text-[13px] font-medium text-slate-500 mt-0.5">Manage users and secure area</p>
                      </div>
                   </div>
                   <ChevronRight size={20} className="text-gray-400" />
                </div>
             )}

             <div className="mx-4 my-2 border-t border-slate-100/60" />

             <button 
                onClick={() => onNavigate('my-loan-details')}
                className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
             >
                <div className="flex items-center gap-4">
                   <div className="bg-blue-50 text-blue-600 w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm border border-blue-100/50">
                      <FileText size={24} strokeWidth={2} />
                   </div>
                   <div className="text-left">
                      <p className="text-[15px] font-bold text-gray-800">My Loan Details</p>
                      <p className="text-[13px] text-gray-500 font-medium">View active loan break-up</p>
                   </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
             </button>

             <button 
                onClick={onLogout}
                className="w-full flex items-center justify-between p-4.5 cursor-pointer hover:bg-red-50 transition"
             >
                <div className="flex items-center gap-4">
                   <div className="bg-red-50 text-red-500 w-12 h-12 flex items-center justify-center rounded-[14px]">
                      <LogOut size={24} strokeWidth={2} />
                   </div>
                   <div className="text-left">
                      <p className="text-[15px] font-bold text-gray-900">Log out</p>
                      <p className="text-[13px] font-medium text-gray-500 mt-0.5">Securely sign out of your account</p>
                   </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
             </button>
           </div>
        </div>

      </div>
    </motion.div>
  );
}


