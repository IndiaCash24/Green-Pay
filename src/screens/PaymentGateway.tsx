import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, QrCode, ClipboardCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Screen } from '../App';

export default function PaymentGateway({ 
  paymentData, 
  onBack, 
  onNavigate 
}: { 
  paymentData: { loanId: string, emiIds: string[], amount: number },
  onBack: () => void,
  onNavigate: (s: Screen) => void
}) {
  const { submitPaymentRequest, paymentRequests, paymentHistory, currentUser, appSettings } = useAppContext();
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDone = async () => {
    if (utrNumber.trim().length < 12) {
      setErrorMsg('Please enter a valid 12-digit UTR number');
      return;
    }
    
    // Check for duplicate UTR
    const isDuplicatePending = paymentRequests.some(req => req.utr === utrNumber.trim());
    const isDuplicateHistory = paymentHistory.some(ph => ph.utr === utrNumber.trim());
    
    if (isDuplicatePending || isDuplicateHistory) {
      setErrorMsg('This UTR number has already been submitted. Please check your payment history or use a different UTR.');
      return;
    }
    
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await submitPaymentRequest({
        userId: currentUser.id,
        userName: currentUser.name,
        amount: paymentData.amount,
        utr: utrNumber.trim(),
        loanId: paymentData.loanId,
        emiIds: paymentData.emiIds
      });

      setShowSuccess(true);
      setTimeout(() => {
        onNavigate('home');
      }, 3000);
    } catch (e) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-full w-full flex-col items-center justify-center bg-[#0b8a40] px-5 text-center"
      >
        <motion.div
           initial={{ scale: 0.5, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ type: "spring", stiffness: 200, damping: 20 }}
           className="bg-white rounded-full p-6 mb-6 shadow-2xl"
        >
          <CheckCircle2 size={80} className="text-[#0b8a40]" />
        </motion.div>
        <h1 className="text-[32px] font-black text-white tracking-tight mb-2">Payment Submitted!</h1>
        <p className="text-white/90 text-[16px] font-medium leading-relaxed max-w-[280px]">
          Your UTR number <span className="font-bold">{utrNumber}</span> has been received. Admin will verify and update your loan details shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full w-full flex-col bg-[#f9fafb] relative overflow-y-auto"
    >
      {/* Header */}
      <div className="bg-[#0b8a40] px-5 pt-12 pb-[60px] rounded-bl-[40px] rounded-br-[40px] relative shadow-sm shrink-0">
        <div className="flex items-center relative z-10 text-white">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="ml-2">
            <h1 className="text-[22px] font-bold tracking-tight">Payment Gateway</h1>
            <p className="text-[13px] text-green-100 font-medium">Complete your payment</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 z-10 pb-[100px]">
        <div className="bg-white rounded-[24px] p-6 shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-gray-100 text-center space-y-6">
           
           <div>
             <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-1">Amount to Pay</p>
             <h2 className="text-[32px] font-bold text-[#0b8a40]">₹{paymentData.amount.toLocaleString('en-IN')}</h2>
           </div>

           <div className="border-t border-b border-gray-100 py-6 my-4 flex flex-col items-center justify-center">
              <div className="w-48 h-48 bg-gray-50 border-2 border-gray-200 rounded-[20px] p-4 flex items-center justify-center relative mx-auto shadow-sm overflow-hidden">
                 {appSettings.qrImageUrl ? (
                   <img src={appSettings.qrImageUrl} alt="Merchant QR" className="w-full h-full object-contain" />
                 ) : (
                   <>
                     <div className="absolute inset-2 border-4 border-gray-900 rounded-[12px]"></div>
                     <div className="absolute top-4 left-4 w-10 h-10 border-4 border-gray-900"></div>
                     <div className="absolute top-4 right-4 w-10 h-10 border-4 border-gray-900"></div>
                     <div className="absolute bottom-4 left-4 w-10 h-10 border-4 border-gray-900"></div>
                     <QrCode size={80} className="text-gray-400" />
                   </>
                 )}
              </div>
              <p className="text-[14px] font-bold text-gray-800 mt-4">Scan QR code using any UPI App</p>
              <div className="flex gap-4 mt-3 opacity-70">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-4 object-contain" />
              </div>
           </div>

           <div className="text-left space-y-3">
             <label className="text-[14px] font-bold text-gray-700 ml-1">Enter UTR Reference Number</label>
             <div className="relative">
                <input 
                  type="text" 
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="e.g. 312345678901"
                  maxLength={12}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[16px] px-4 py-4 text-[16px] font-bold tracking-widest text-gray-900 focus:border-[#0b8a40] focus:bg-white outline-none transition-all placeholder:text-gray-400 placeholder:tracking-normal placeholder:font-medium"
                />
             </div>
             {errorMsg && <p className="text-red-500 text-[12px] font-bold mt-1 ml-1">{errorMsg}</p>}
             <p className="text-[11px] text-gray-500 font-medium px-2 leading-relaxed">
               After successful payment, please enter the 12-digit UPI reference number (UTR) to confirm your transaction.
             </p>
           </div>
           
           <button 
              onClick={handleDone}
              disabled={isSubmitting}
              className="w-full bg-[#0b8a40] text-white rounded-[16px] py-4.5 mt-2 flex items-center justify-center gap-3 shadow-[0_8px_20px_rgb(11,138,64,0.25)] hover:bg-[#0a7a38] active:scale-[0.98] transition font-bold text-[16px]"
           >
              {isSubmitting ? (
                 <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white"
                />
              ) : (
                <>Submit Payment <CheckCircle2 size={20} strokeWidth={2.5} /></>
              )}
           </button>
        </div>
      </div>
    </motion.div>
  );
}
