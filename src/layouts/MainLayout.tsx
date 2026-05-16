import { ReactNode } from 'react';
import { Home as HomeIcon, MoreHorizontal } from 'lucide-react';
import { type Screen } from '../App';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export default function MainLayout({ children, currentScreen, onNavigate }: LayoutProps) {
  return (
    <div className="flex h-full w-full flex-col bg-[#f9fafb] relative">
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-24 scrollbar-none">
        {children}
      </div>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-[320px]">
        <div className="bg-white rounded-full px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100/50 flex items-center justify-between backdrop-blur-xl bg-white/95">
          
          <button 
            onClick={() => onNavigate('home')}
            className={cn("flex flex-col items-center justify-center w-14 gap-1 transition-all", currentScreen === 'home' || currentScreen === 'notifications' ? "-translate-y-1" : "hover:-translate-y-0.5")}
          >
            <div className={cn("p-2 rounded-full transition-colors", currentScreen === 'home' || currentScreen === 'notifications' ? "bg-green-50 text-[#0b8a40]" : "text-gray-400")}>
              <HomeIcon size={22} strokeWidth={2.5} />
            </div>
            <span className={cn("text-[10px] font-bold transition-all", currentScreen === 'home' || currentScreen === 'notifications' ? "text-[#0b8a40] opacity-100" : "text-gray-400 opacity-80")}>
              Home
            </span>
          </button>

          <button 
            onClick={() => onNavigate('repayment')}
            className="flex flex-col items-center justify-center -mt-8 relative group"
          >
            <div className="h-[60px] w-[60px] bg-[#0b8a40] rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgb(11,138,64,0.3)] group-hover:scale-105 active:scale-95 transition-transform border-[4px] border-white ring-1 ring-gray-100">
               <span className="text-xl font-bold">₹</span>
            </div>
            <span className="text-[10px] font-bold text-[#0b8a40] mt-1.5 opacity-90">Pay Now</span>
          </button>

          <button 
            onClick={() => onNavigate('profile')}
            className={cn("flex flex-col items-center justify-center w-14 gap-1 transition-all", currentScreen === 'profile' ? "-translate-y-1" : "hover:-translate-y-0.5")}
          >
            <div className={cn("p-2 rounded-full transition-colors", currentScreen === 'profile' ? "bg-green-50 text-[#0b8a40]" : "text-gray-400")}>
              <MoreHorizontal size={22} strokeWidth={2.5} />
            </div>
            <span className={cn("text-[10px] font-bold transition-all", currentScreen === 'profile' ? "text-[#0b8a40] opacity-100" : "text-gray-400 opacity-80")}>
              More
            </span>
          </button>
          
        </div>
      </div>
    </div>
  );
}
