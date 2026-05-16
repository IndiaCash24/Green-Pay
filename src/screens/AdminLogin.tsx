import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronLeft, Lock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminLogin({ onBack, onLogin }: { onBack: () => void, onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      setIsLoading(false);
      if (password === 'Smh53*#@') {
        onLogin();
      } else {
        setError('Invalid admin password');
      }
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex h-full w-full flex-col bg-slate-900 text-white relative"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      
      <div className="flex items-center p-4 z-10 relative">
        <button onClick={onBack} className="p-2 rounded-full bg-slate-800 text-white active:bg-slate-700 transition">
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        <div className="mb-6 rounded-3xl bg-blue-500/20 p-5 backdrop-blur-md ring-2 ring-blue-500/50 shadow-inner">
          <ShieldCheck size={56} className="text-blue-400 drop-shadow-md" />
        </div>
        
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Admin Portal</h2>
        <p className="text-slate-400 font-medium mb-10 text-center">Enter security key to access administration dashboard and approvals.</p>
        
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-slate-400" size={20} />
              <input 
                type="password"
                placeholder="Enter security key"
                className="w-full rounded-2xl border border-slate-700 bg-slate-800 py-4 pl-12 pr-4 text-white placeholder:text-slate-500 transition-all focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
              />
            </div>
            {error && <p className="text-red-400 text-sm font-semibold pl-2">{error}</p>}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-center text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]",
              isLoading ? "opacity-80" : "hover:from-blue-500 hover:to-indigo-500"
            )}
          >
            {isLoading ? (
               <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="mx-auto h-6 w-6 rounded-full border-2 border-white/30 border-t-white"
              />
            ) : (
              "Authorize Access"
            )}
          </button>
        </form>
      </div>
      
      <div className="pb-8 text-center text-xs font-semibold text-slate-500 z-10">
        Secured area. Unauthorized access is strictly prohibited.
      </div>
    </motion.div>
  );
}
