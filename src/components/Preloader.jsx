import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[1000] bg-[#FF0087] flex flex-col items-center justify-between py-20 px-6 overflow-hidden"
    >
      {/* Background structural rings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="w-[100vh] h-[100vh] border-[100px] border-[#B0FFFA] rounded-full"
        />
      </div>

      {/* Top Counter */}
      <div className="relative z-10 w-full max-w-7xl flex justify-between items-start">
        <div className="text-[#B0FFFA] font-black tracking-widest text-sm uppercase">Nestly / 2026</div>
        <div className="text-[#B0FFFA] text-8xl md:text-[12rem] font-black leading-none tracking-tighter tabular-nums">
          {progress.toString().padStart(2, '0')}%
        </div>
      </div>

      {/* Center Tagline */}
      <div className="relative z-10 text-center max-w-4xl">
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-5xl font-black text-[#B0FFFA] italic leading-tight uppercase tracking-tighter"
        >
          Personalized <br />
          <span className="text-[#00F7FF]">bedtime stories</span> <br />
          powered by AI
        </motion.h2>
      </div>

      {/* Bottom Loading Bar (Structural) */}
      <div className="relative z-10 w-full max-w-7xl bg-[#B0FFFA]/20 h-1 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-[#00F7FF]"
        />
      </div>
    </motion.div>
  );
}
