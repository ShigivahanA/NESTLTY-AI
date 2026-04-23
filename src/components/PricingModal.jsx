import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Crown, Shield, CreditCard, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useSubscription } from '../SubscriptionContext';

export default function PricingModal({ isOpen, onClose }) {
  const { plans, upgrade, subscription } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null); // 'pro' or 'elite'
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleMockPayment = async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    
    // Simulate Razorpay Delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await upgrade(selectedPlan);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-[4rem] overflow-hidden border-4 border-[#FF0087]/20 flex flex-col lg:flex-row"
      >
        {/* CLOSE BUTTON */}
        <button onClick={onClose} className="absolute top-8 right-8 z-50 text-white/20 hover:text-white transition-colors">
          <X size={32} />
        </button>

        {/* LEFT: PLANS GRID */}
        <div className="flex-grow p-10 lg:p-20 overflow-y-auto max-h-[80vh] lg:max-h-none">
          <div className="mb-12">
            <h2 className="text-5xl lg:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
              CHOOSE YOUR <br /> <span className="text-[#00F7FF]">POWER.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(plans).map(([key, plan]) => {
              const isCurrent = subscription?.tier === key;
              return (
                <div 
                  key={key}
                  onClick={() => !isCurrent && key !== 'free' && setSelectedPlan(key)}
                  className={`relative p-8 rounded-[3rem] border-4 transition-all flex flex-col ${
                    selectedPlan === key 
                      ? 'border-[#00F7FF] bg-[#00F7FF]/5' 
                      : isCurrent 
                        ? 'border-[#FF0087] bg-[#FF0087]/5' 
                        : 'border-white/5 hover:border-white/20 cursor-pointer'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF0087] text-white text-[10px] font-black uppercase px-4 py-1 rounded-full">Current</div>
                  )}
                  
                  <h3 className="text-2xl font-black italic uppercase text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-black text-white">${plan.price}</span>
                    <span className="text-xs font-bold text-white/20 uppercase">/month</span>
                  </div>

                  <div className="space-y-4 mb-10 flex-grow">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-3 text-[11px] font-bold text-white/60 uppercase tracking-tight">
                        <Check size={14} className="text-[#00F7FF] shrink-0 mt-0.5" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: MOCK CHECKOUT */}
        <AnimatePresence>
          {(selectedPlan || showSuccess) && (
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="lg:w-[400px] bg-[#FF0087] p-10 lg:p-16 flex flex-col items-center justify-center text-center shrink-0"
            >
              {showSuccess ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="space-y-6">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#FF0087] mx-auto shadow-2xl">
                    <Check size={48} strokeWidth={4} />
                  </div>
                  <h4 className="text-4xl font-black italic uppercase text-white tracking-tighter">UNLOCKED!</h4>
                  <p className="text-white/80 font-bold uppercase tracking-widest text-[10px]">Your magical powers have been upgraded.</p>
                </motion.div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-white mb-8">
                    <CreditCard size={40} />
                  </div>
                  <h4 className="text-3xl font-black italic uppercase text-white tracking-tighter mb-2">SECURE PAYMENT</h4>
                  <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] mb-12">Razorpay Sandbox Mode</p>

                  <div className="w-full bg-black/10 rounded-3xl p-8 mb-12 text-left space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-[10px] font-black uppercase text-white/40">PLAN</span>
                      <span className="text-xl font-black italic uppercase text-white">{plans[selectedPlan].name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-white/40">TOTAL</span>
                      <span className="text-3xl font-black text-white">${plans[selectedPlan].price}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleMockPayment}
                    disabled={isProcessing}
                    className="w-full py-6 bg-white text-[#FF0087] rounded-[2rem] text-xl font-black italic uppercase tracking-tighter shadow-2xl hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-4"
                  >
                    {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <>PAY NOW <Zap size={20} fill="currentColor" /></>}
                  </button>
                  <p className="mt-8 text-[9px] font-bold text-white/40 uppercase tracking-widest">Mock Transaction - No real money used</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
