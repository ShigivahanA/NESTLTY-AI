import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { auth } from '../services/db';

export default function Hero() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check initial user
    auth.getUser().then(({ data: { user } }) => setUser(user));

    // Subscription for real-time state changes
    const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Scroll animations
  const yLabel = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const yPara = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center bg-[#B0FFFA] text-[#FF0087] px-6 py-10 overflow-hidden font-sans"
    >

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center"
      >
        {/* Subtle, Unorthodox Top Label */}
        <motion.div
          variants={itemVariants}
          style={{ y: yLabel }}
          className="flex items-center gap-4 mb-12"
        >
          <div className="w-12 h-[3px] bg-[#00F7FF]" />
          <span className="font-black uppercase tracking-[0.5em] text-sm bg-gradient-to-r from-[#00F7FF] via-[#FF0087] to-[#00F7FF] bg-clip-text text-transparent animate-gradient-x">
            Imagine Daily
          </span>
          <div className="w-12 h-[3px] bg-[#FF0087]" />
        </motion.div>

        {/* Clean, Impactful Typography */}
        <div className="mb-12 space-y-4">
          <motion.h1
            variants={itemVariants}
            style={{ y: yTitle }}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase"
          >
            THE HERO IS <br />
            <span className="text-[#00F7FF]">ALIVE</span> TONIGHT.
          </motion.h1>
          <motion.p
            variants={itemVariants}
            style={{ y: yPara }}
            className="text-xl md:text-2xl font-bold text-[#FF7DB0] tracking-tight mt-6"
          >
            Personalized bedtime stories where your child <br className="hidden md:block" />
            holds the keys to the kingdom.
          </motion.p>
        </div>

        {/* Simplest Unorthodox CTA */}
        <motion.div
           variants={itemVariants}
           className="mt-8"
         >
           <button
             onClick={() => navigate(user ? "/dashboard" : "/auth")}
             className="group relative flex items-center justify-center cursor-pointer"
           >
             <div className="absolute inset-0 border-4 border-[#00F7FF] rounded-2xl translate-x-3 translate-y-3 transition-transform group-hover:translate-x-0 group-hover:translate-y-0" />
             <div className="relative bg-[#FF0087] text-[#B0FFFA] px-12 py-6 rounded-2xl text-2xl font-black italic flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98]">
               <span>UNLEASH MAGIC</span>
               <ArrowRight className="group-hover:translate-x-2 transition-transform" />
             </div>
           </button>
         </motion.div>

        {/* High-End Dynamic Story Ticker */}
        <motion.div
          variants={itemVariants}
          className="mt-24 w-screen overflow-hidden border-y-2 border-[#FF0087]/20 py-8 bg-[#FF0087]/5 relative pointer-events-none"
        >
          {/* Masking Gradients */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#B0FFFA] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#B0FFFA] to-transparent z-10" />

          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-16 text-3xl md:text-5xl font-black italic tracking-tighter text-[#00F7FF]"
          >
            {[
              "SPACE ADVENTURES", "JUNGLE EXPLORATION", "DEEP SEA DISCOVERY",
              "DINOSAUR REIGN", "MAGIC KINGDOMS", "VOLCANO MISSIONS",
              "SPACE ADVENTURES", "JUNGLE EXPLORATION", "DEEP SEA DISCOVERY"
            ].map((theme, i) => (
              <div key={i} className="flex items-center gap-6">
                <span className="opacity-40"><Sparkles /></span>
                <span>{theme}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
