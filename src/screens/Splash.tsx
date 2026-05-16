import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export default function Splash() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full w-full flex-col items-center justify-between bg-[#f8fafc] relative overflow-hidden py-16 px-6 text-center"
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="mb-6 rounded-full bg-[#0b8a40]/10 p-5 ring-1 ring-[#0b8a40]/20 shadow-sm">
            <ShieldCheck size={56} className="text-[#0b8a40]" strokeWidth={1.5} />
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">GreenPay</h1>
          <p className="text-[16px] font-medium text-slate-500">Secure Loan & Repayment Solutions</p>
          
          <div className="mt-8 text-[14px] text-slate-600 space-y-2 max-w-xs leading-relaxed font-medium">
             <p>Empowering financial stability with simple, transparent, and trusted services.</p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex space-x-1.5 mb-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#0b8a40]"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase">Loading Workspace</p>
      </motion.div>
    </motion.div>
  );
}
