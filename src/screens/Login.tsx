import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Fingerprint, ShieldCheck, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);
    
    try {
      if (view === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        onLogin();
      } else if (view === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', cred.user.uid), {
          id: cred.user.uid,
          name: name || 'User',
          email: email,
          createdAt: new Date().toISOString()
        }, { merge: true });
        onLogin();
      } else if (view === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg('Password reset email sent! Check your inbox.');
        setTimeout(() => setView('login'), 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex h-full w-full flex-col bg-white overflow-y-auto"
    >
      <div className="relative flex h-64 w-full flex-col items-center justify-center bg-gradient-to-br from-green-primary to-green-dark text-white rounded-b-[40px] shadow-lg shrink-0">
        <div className="absolute inset-0 bg-white/5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 rounded-b-[40px]" />
        <div className="z-10 flex flex-col items-center">
           <div className="mb-4 rounded-3xl bg-white/20 p-4 backdrop-blur-md ring-2 ring-white/50 shadow-inner">
             <ShieldCheck size={48} className="text-white drop-shadow-md" />
           </div>
           <h2 className="text-3xl font-bold tracking-tight">
             {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Create Account' : 'Reset Password'}
           </h2>
           <p className="mt-1 text-green-100 font-medium tracking-wide">GreenPay Loan Services</p>
        </div>
      </div>

      <div className="px-6 pt-8 pb-6 flex-1 flex flex-col z-20">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
          <div className="space-y-4">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100">
                 {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-medium border border-green-100">
                 {successMsg}
              </div>
            )}
            
            {view === 'signup' && (
              <div className="relative">
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-green-primary" size={20} />
                  <input 
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 transition-all focus:border-green-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-primary/20"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-green-primary" size={20} />
                <input 
                  type="email"
                  required
                  placeholder="Enter email address"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 transition-all focus:border-green-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-primary/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {view !== 'forgot' && (
              <div className="relative">
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-green-primary" size={20} />
                  <input 
                    type="password"
                    required
                    placeholder="Enter password"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-900 transition-all focus:border-green-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-primary/20"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {view === 'login' && (
              <div className="flex items-center justify-end mt-2">
                <button type="button" onClick={() => { setView('forgot'); setErrorMsg(''); setSuccessMsg(''); }} className="text-sm font-bold text-green-primary hover:text-green-dark">
                  Forgot Password?
                </button>
              </div>
            )}
            {view === 'forgot' && (
              <div className="flex items-center justify-center mt-2">
                <button type="button" onClick={() => { setView('login'); setErrorMsg(''); setSuccessMsg(''); }} className="text-sm font-bold text-gray-500 hover:text-gray-700">
                  Back to Login
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 flex flex-col items-center space-y-5">
            <button 
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full rounded-2xl bg-gradient-to-r from-green-primary to-green-dark py-4 text-center text-lg font-bold text-white shadow-lg shadow-green-primary/30 transition-all active:scale-[0.98]",
                isLoading ? "opacity-80" : "hover:from-green-dark hover:to-green-primary"
              )}
            >
              {isLoading ? (
                 <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mx-auto h-6 w-6 rounded-full border-2 border-white/30 border-t-white"
                />
              ) : (
                view === 'login' ? 'Secure Login' : view === 'signup' ? 'Create Account' : 'Send Reset Link'
              )}
            </button>
            
            {view !== 'forgot' && (
               <div className="flex w-full items-center justify-center pt-2">
                 <span className="text-sm font-medium text-gray-600">
                   {view === 'login' ? "Don't have an account?" : "Already have an account?"}
                 </span>
                 <button 
                   type="button" 
                   onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setErrorMsg(''); setSuccessMsg(''); }} 
                   className="ml-2 pl-2 border-l border-gray-300 text-sm font-bold text-green-primary hover:text-green-dark"
                 >
                   {view === 'login' ? 'Sign Up' : 'Log In'}
                 </button>
               </div>
            )}

          </div>
        </form>
      </div>
    </motion.div>
  );
}
