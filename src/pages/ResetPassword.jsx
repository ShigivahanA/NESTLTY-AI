import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Key, Check, AlertCircle, Loader2, FastForward } from 'lucide-react';
import { auth, supabase } from '../services/db';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
     // Verify we have a session (recovery link automatically creates one)
     const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
           navigate('/auth');
        }
     };
     checkSession();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#B0FFFA] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* 🔮 BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FF0087] rounded-full blur-[150px] opacity-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00F7FF] rounded-full blur-[150px] opacity-10" />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white w-full max-w-xl rounded-[4rem] p-12 md:p-20 border-8 border-[#00F7FF] relative z-10 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-12 text-[#FF0087]">
          <Key size={48} className="text-[#00F7FF]" />
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">CREATE <br /> <span className="text-[#00F7FF]">NEW PASS.</span></h1>
        </div>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center space-y-8"
            >
              <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <Check size={48} strokeWidth={4} />
              </div>
              <div className="space-y-4">
                 <h2 className="text-4xl font-black italic uppercase text-[#FF0087] tracking-tighter">PASSWORD UPDATED!</h2>
                 <p className="text-lg font-bold text-[#FF7DB0] uppercase tracking-widest">Taking you to dashboard...</p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-8">
              {error && (
                <div className="bg-[#00F7FF]/20 border-4 border-[#FF0087] p-6 rounded-[2rem] flex items-start gap-4">
                  <AlertCircle className="text-[#FF0087] shrink-0" size={24} />
                  <p className="text-[#FF0087] font-black uppercase italic text-xs leading-tight">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0] ml-4">NEW PASSWORD</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FF7DB0]" />
                  <input 
                    required type="password"
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full bg-[#B0FFFA]/10 border-4 border-[#FF0087]/10 rounded-3xl pl-16 pr-8 py-6 text-2xl font-black italic text-[#FF0087] focus:border-[#00F7FF] outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0] ml-4">CONFIRM PASSWORD</label>
                <div className="relative">
                  <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FF7DB0]" />
                  <input 
                    required type="password"
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full bg-[#B0FFFA]/10 border-4 border-[#FF0087]/10 rounded-3xl pl-16 pr-8 py-6 text-2xl font-black italic text-[#FF0087] focus:border-[#00F7FF] outline-none transition-all" 
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                type="submit" 
                className="w-full py-8 bg-[#00F7FF] text-[#FF0087] font-black rounded-3xl text-3xl italic uppercase tracking-tighter hover:bg-[#FF0087] hover:text-white transition-all shadow-xl disabled:opacity-50 mt-6 flex items-center justify-center gap-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'UPDATE MAGIC'} <FastForward size={32} fill="currentColor" />
              </button>
            </form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
