import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, User, FastForward, Stars, BookOpen, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, supabase } from '../services/db';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error: signInError } = await auth.signIn(formData.email, formData.password);
        if (signInError) throw signInError;
        navigate('/dashboard');
      } else {
        const { data, error: signUpError } = await auth.signUp(formData.email, formData.password);
        if (signUpError) throw signUpError;
        setError("Account created! Please check your email to verify.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email first.");
      return;
    }
    setLoading(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetError) throw resetError;
      setResetSent(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#B0FFFA] flex overflow-hidden font-sans relative">

      {/* 1. KINETIC DECOR LAYER */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FF0087] rounded-full blur-[180px] opacity-10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00F7FF] rounded-full blur-[180px] opacity-10" />
      </div>

      {/* 2. THE BRAND COLUMN */}
      <div className="hidden lg:flex w-1/2 bg-[#FF0087] flex-col justify-center p-24 relative overflow-hidden h-full">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 border-[40px] border-[#B0FFFA] rounded-full border-dashed"
        />

        <div className="relative z-10 max-w-xl">
          <h1 className="text-[10vw] font-black italic tracking-tighter text-[#B0FFFA] leading-[0.8] uppercase mb-10">
            HELLO. <br /> <span className="text-[#00F7FF]">READY?</span>
          </h1>
          <p className="text-3xl font-bold text-[#B0FFFA] italic uppercase opacity-80 leading-tight">
            Join thousands of parents and start creating stories for your kids today.
          </p>
        </div>
      </div>

      {/* 3. THE FORM COLUMN */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative h-full overflow-hidden">
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-lg relative z-10"
        >
          <div className="space-y-6 w-full">
            <div className="h-40 flex flex-col justify-end w-full">
              <h2 className="text-7xl font-black italic tracking-tighter text-[#FF0087] uppercase leading-none mb-2">
                {resetSent ? 'SENT!' : isLogin ? 'WELCOME.' : 'JOIN US.'}
              </h2>
              <p className="text-lg font-black text-[#FF0087] opacity-60 uppercase italic">
                {resetSent ? 'Check your inbox for a magic link' : isLogin ? 'Login to continue' : 'Sign up for free'}
              </p>
            </div>

            <div className="relative w-full">
              {/* ERROR/SUCCESS BANNER */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-8 overflow-hidden"
                  >
                    <div className="bg-[#00F7FF] border-4 border-[#FF0087] p-6 rounded-[2rem] flex items-start gap-4 shadow-xl">
                      <AlertCircle className="text-[#FF0087] shrink-0" size={24} />
                      <p className="text-[#FF0087] font-black uppercase italic text-xs leading-tight">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative min-h-[480px] w-full">
                <AnimatePresence initial={false} mode="wait">
                  {resetSent ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full flex flex-col items-center justify-center py-20 text-center space-y-8"
                    >
                      <div className="w-24 h-24 bg-[#00F7FF] rounded-full flex items-center justify-center text-[#FF0087] shadow-2xl animate-bounce">
                        <CheckCircle2 size={48} strokeWidth={3} />
                      </div>
                      <button 
                        onClick={() => setResetSent(false)}
                        className="text-lg font-black text-[#FF0087] uppercase italic border-b-2 border-[#FF0087]/20 pb-2 hover:border-[#FF0087] transition-all"
                      >
                        BACK TO LOGIN
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key={isLogin ? 'login' : 'signup'}
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full space-y-5"
                    >
                      {!isLogin && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#FF0087] ml-2">Full Name</label>
                          <div className="relative group">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#FF7DB0] group-focus-within:text-[#00F7FF] transition-colors" />
                            <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required
                              placeholder="Your Name"
                              className="w-full bg-white border-4 border-[#FF0087]/10 rounded-[2rem] pl-16 pr-6 py-5 text-[#FF0087] font-black italic placeholder:text-[#FF0087]/20 focus:border-[#FF0087] outline-none transition-all shadow-lg"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#FF0087] ml-2">Email Address</label>
                        <div className="relative group">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#FF7DB0] group-focus-within:text-[#00F7FF] transition-colors" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="hello@email.com"
                            className="w-full bg-white border-4 border-[#FF0087]/10 rounded-[2rem] pl-16 pr-6 py-5 text-[#FF0087] font-black italic placeholder:text-[#FF0087]/20 focus:border-[#FF0087] outline-none transition-all shadow-lg"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center px-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#FF0087]">Password</label>
                          {isLogin && (
                            <button 
                              type="button" 
                              onClick={handleResetPassword}
                              className="text-[10px] font-black uppercase text-[#FF7DB0] hover:text-[#00F7FF] transition-colors"
                            >
                              Forgot?
                            </button>
                          )}
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#FF7DB0] group-focus-within:text-[#00F7FF] transition-colors" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="••••••••"
                            className="w-full bg-white border-4 border-[#FF0087]/10 rounded-[2rem] pl-16 pr-16 py-5 text-[#FF0087] font-black italic placeholder:text-[#FF0087]/20 focus:border-[#FF0087] outline-none transition-all shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-6 top-1/2 -translate-y-1/2 text-[#FF7DB0] hover:text-[#00F7FF] transition-colors"
                          >
                            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button
                          disabled={loading}
                          type="submit"
                          className="w-full py-7 bg-[#FF0087] text-[#B0FFFA] font-black rounded-[2.5rem] text-3xl italic uppercase tracking-tighter hover:bg-[#00F7FF] hover:text-[#FF0087] transition-all relative overflow-hidden group shadow-[0_20px_40px_rgba(255,0,135,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-4">
                            {loading ? 'PROCESSING...' : (isLogin ? 'SIGN IN' : 'SIGN UP')} <FastForward size={32} fill="currentColor" className={loading ? 'animate-pulse' : ''} />
                          </span>
                        </button>
                      </div>

                      {/* STABLE BOTTOM ACTIONS */}
                      <div className="mt-6 flex flex-col items-center gap-4 relative z-20">
                        <button
                          type="button"
                          onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                          }}
                          className="text-lg font-black text-[#FF0087] uppercase italic border-b-2 border-[#FF0087]/10 pb-1 hover:border-[#FF0087] transition-all"
                        >
                          {isLogin ? 'Need an account? Sign Up' : 'Already a member? Sign In'}
                        </button>
                        <p className="text-[10px] font-black text-[#FF0087] opacity-40 uppercase tracking-widest">
                          BY JOINING, YOU AGREE TO OUR TERMS
                        </p>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Link({ to, children, className }) {
  return <a href={to} className={className}>{children}</a>;
}
