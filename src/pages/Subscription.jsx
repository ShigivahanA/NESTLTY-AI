import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Crown, Shield, CreditCard, Sparkles, Loader2, ArrowLeft, Heart, Star, Lock } from 'lucide-react';
import { useSubscription } from '../SubscriptionContext';
import { auth } from '../services/db';

export default function Subscription() {
  const navigate = useNavigate();
  const { plans, upgrade, subscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (paymentSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/dashboard');
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentSuccess, navigate]);

  const handlePayment = async (planKey) => {
    const plan = plans[planKey];
    if (planKey === 'free') return;

    setIsProcessing(true);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RpMHTpbmcooyAO",
      amount: plan.price * 100, // Amount in paise
      currency: "INR",
      name: "Nestly AI",
      description: `Upgrade to ${plan.name} Plan`,
      image: "/favicon.svg",
      handler: async function (response) {
        console.log("Razorpay Success Response:", response);
        try {
          await upgrade(planKey);
          setPaymentSuccess(true);
        } catch (err) {
          console.error("Upgrade error details:", err);
          alert(`Upgrade failed: ${err.message || "Please contact support."}`);
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        email: (await auth.getUser()).data.user?.email || "",
      },
      theme: {
        color: "#FF0087",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-[#B0FFFA] pt-32 pb-24 px-6 font-sans relative overflow-x-hidden">

      {/* 🔮 MAGIC BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#FF0087] rounded-full blur-[180px] opacity-[0.08]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#00F7FF] rounded-full blur-[150px] opacity-[0.05]" />
        <div className="absolute top-[40%] left-[30%] w-4 h-4 bg-white rounded-full blur-xl animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        <header className="mb-24 text-center">
          <h1 className="text-7xl md:text-[9vw] font-black italic tracking-tighter leading-[0.8] uppercase text-[#FF0087] mb-8">
            UNLOCK <br /> <span className="text-[#00F7FF]">THE MAGIC.</span>
          </h1>
          <p className="text-xl font-black text-[#FF7DB0] uppercase italic tracking-widest max-w-2xl mx-auto leading-relaxed">
            Choose your tier and start crafting endless adventures for your little heroes.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {paymentSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="py-24 text-center space-y-10 bg-white border-[12px] border-[#00F7FF] rounded-[5rem] shadow-[20px_20px_0px_#00F7FF] max-w-4xl mx-auto overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-[#FF0087] via-[#00F7FF] to-[#FF0087]" />

              <div className="w-32 h-32 bg-[#00F7FF] rounded-full flex items-center justify-center text-white mx-auto animate-bounce shadow-2xl">
                <Check size={64} strokeWidth={5} />
              </div>

              <div className="space-y-4">
                <h2 className="text-6xl md:text-7xl font-black italic uppercase text-[#FF0087] tracking-tighter leading-none">THANK YOU!</h2>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-2xl font-black text-[#00F7FF] uppercase tracking-tighter">Your Magic is now active</p>
                  <p className="text-sm font-bold text-[#FF7DB0] uppercase tracking-widest bg-[#FF7DB0]/5 px-6 py-2 rounded-full">
                    Redirecting in {countdown}s...
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-16 py-8 bg-[#FF0087] text-white rounded-full text-xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                GIVE ME THE MAGIC ❯
              </button>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10 items-stretch">
              {Object.entries(plans).map(([key, plan], idx) => {
                const isCurrent = subscription?.tier === key;
                const isElite = key === 'elite';
                const isPro = key === 'pro';

                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative bg-white p-12 rounded-[4rem] border-4 flex flex-col transition-all group overflow-hidden ${isElite
                      ? 'border-[#FF0087] shadow-[16px_16px_0px_#FF0087] scale-105 z-20'
                      : isPro
                        ? 'border-[#00F7FF] shadow-[12px_12px_0px_#00F7FF] z-10'
                        : 'border-[#FF7DB0]/20 shadow-xl'
                      }`}
                  >
                    {/* Floating Tier Icon Decor */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 bg-current opacity-5 rounded-full blur-3xl pointer-events-none group-hover:opacity-10 transition-opacity" style={{ color: isElite ? '#FF0087' : isPro ? '#00F7FF' : '#FF7DB0' }} />

                    {isElite && (
                      <div className="absolute top-8 right-10 flex items-center gap-2 px-4 py-1.5 bg-[#FF0087] text-white text-[8px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg z-10">
                        <Sparkles size={10} /> UNLIMITED MAGIC
                      </div>
                    )}

                    {isCurrent && (
                      <div className="absolute top-8 right-10 flex items-center gap-2 px-4 py-1.5 bg-[#00F7FF] text-[#FF0087] text-[8px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg z-10">
                        ACTIVE PLAN
                      </div>
                    )}

                    <div className="mb-12 relative">
                      <div className={`w-20 h-20 rounded-3xl mb-10 flex items-center justify-center text-white shadow-2xl transform group-hover:rotate-6 transition-transform ${isElite ? 'bg-[#FF0087]' : isPro ? 'bg-[#00F7FF]' : 'bg-gray-200'}`}>
                        {isElite ? <Crown size={40} strokeWidth={2.5} /> : isPro ? <Zap size={40} strokeWidth={2.5} /> : <Star size={40} strokeWidth={2.5} />}
                      </div>
                      <h3 className="text-4xl font-black italic uppercase text-[#FF0087] tracking-tighter mb-4">{plan.name}</h3>
                      <div className="flex items-baseline gap-3">
                        <span className="text-7xl font-black text-[#FF0087] tracking-tighter">₹{plan.price}</span>
                        <span className="text-sm font-black text-[#FF7DB0] uppercase tracking-widest">/ Month</span>
                      </div>
                    </div>

                    <div className="space-y-6 mb-16 flex-grow">
                      {plan.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-4 text-sm font-black text-[#FF7DB0] uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isElite ? 'bg-[#FF0087]/10 text-[#FF0087]' : 'bg-[#00F7FF]/10 text-[#00F7FF]'}`}>
                            <Check size={12} strokeWidth={4} />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={isCurrent || isProcessing}
                      onClick={() => handlePayment(key)}
                      className={`w-full py-8 rounded-[2.5rem] text-2xl font-black italic uppercase tracking-tighter transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden group/btn ${isCurrent
                        ? 'bg-gray-50 text-gray-300 cursor-not-allowed border-2 border-gray-100'
                        : isElite
                          ? 'bg-[#FF0087] text-white hover:bg-[#00F7FF] hover:text-[#FF0087]'
                          : 'bg-[#00F7FF] text-[#FF0087] hover:bg-[#FF0087] hover:text-white'
                        }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="animate-spin" />
                      ) : isCurrent ? (
                        <span className="flex items-center gap-3">CURRENT <Lock size={20} /></span>
                      ) : key === 'free' ? (
                        'DEFAULT ACCESS'
                      ) : (
                        'UPGRADE NOW ❯'
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        <footer className="mt-24 max-w-3xl mx-auto space-y-12">
          <div className="p-10 md:p-16 bg-white border-4 border-[#FF0087]/10 rounded-[5rem] text-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#FF0087]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms]" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <Shield size={48} className="text-[#00F7FF]" />
              <p className="text-[#FF7DB0] font-black uppercase tracking-[0.25em] text-xs leading-relaxed max-w-xl">
                Transactions are encrypted and handled securely by <span className="text-[#FF0087]">Razorpay</span>. You'll get instant access to all pro features the moment payment is confirmed.
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-gray-50 rounded-xl text-[8px] font-black text-gray-400 border border-gray-100">PCI-DSS COMPLIANT</div>
                <div className="px-4 py-2 bg-gray-50 rounded-xl text-[8px] font-black text-gray-400 border border-gray-100">SECURE SSL</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[10px] font-black text-[#FF7DB0]/40 uppercase tracking-[0.5em]">
              Questions about magic? <span className="text-[#FF0087] hover:underline cursor-pointer">Visit Support Center</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
