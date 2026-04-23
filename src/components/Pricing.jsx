import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowUpRight, Zap, Target, Star } from 'lucide-react';
import { auth } from '../services/db';

export default function Pricing() {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const tiers = [
    {
      id: "free",
      name: "FREE",
      price: "₹0",
      color: "#FF0087",
      accent: "#B0FFFA",
      sub: "Neural Seed",
      features: ["3 STORIES", "BASIC VOICE", "PUBLIC BANK"],
      icon: <Target size={40} className="md:w-[60px] md:h-[60px]" />
    },
    {
      id: "pro",
      name: "PRO",
      price: "₹299",
      color: "#00F7FF",
      accent: "#FF0087",
      sub: "Engine Core",
      features: ["50 STORIES", "HD NARRATOR", "PRIORITY GEN"],
      icon: <Zap size={40} className="md:w-[60px] md:h-[60px]" />
    },
    {
      id: "elite",
      name: "ELITE",
      price: "₹599",
      color: "#FF7DB0",
      accent: "#FF0087",
      sub: "Reality Peak",
      features: ["UNLIMITED", "ATMOS AUDIO", "ELITE SUPPORT"],
      icon: <Star size={40} className="md:w-[60px] md:h-[60px]" />
    }
  ];

  const handleSelect = (tierId) => {
    if (user) {
      navigate('/dashboard/subscription');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section id="pricing" className="min-h-screen md:h-screen bg-[#B0FFFA] relative overflow-hidden flex flex-col font-sans">

      {/* Background Section Label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 md:rotate-0 text-[20vw] font-black text-[#FF0087]/5 select-none pointer-events-none z-0 hidden md:block">
        EXCHANGE
      </div>

      <div className="flex-grow flex flex-col md:flex-row relative z-10 h-full">
        {tiers.map((t, i) => (
          <motion.div
            key={t.id}
            onHoverStart={() => setHoveredIndex(i)}
            onHoverEnd={() => setHoveredIndex(null)}
            onClick={() => handleSelect(t.id)}
            layout
            animate={{
              flexGrow: hoveredIndex === i ? 10 : 1,
              height: hoveredIndex === i ? "80vh" : "10vh",
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 30,
              mass: 1
            }}
            className="md:!h-full relative border-b-4 md:border-b-0 md:border-r-8 last:border-r-0 border-[#B0FFFA] group overflow-hidden cursor-pointer"
            style={{ backgroundColor: t.color }}
          >
            {/* LARGE VERTICAL TITLE */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <motion.h3
                animate={{
                  opacity: hoveredIndex === i ? 0.05 : 0.1,
                  scale: hoveredIndex === i ? 1.5 : 1
                }}
                className="text-[15vh] md:text-[30vh] font-black italic md:-rotate-90 select-none whitespace-nowrap uppercase"
                style={{ color: t.accent }}
              >
                {t.name}
              </motion.h3>
            </div>

            {/* CONTENT OVERLAY */}
            <div className="relative h-full p-8 md:p-12 flex flex-col justify-between" style={{ color: t.accent }}>

              <div className="flex flex-col">
                <div className="mb-6 md:mb-12 flex justify-between items-start">
                  <div className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-[#B0FFFA]/10 backdrop-blur-xl border-2 md:border-4 border-current">
                    {t.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] md:text-xs font-black tracking-widest uppercase opacity-60 italic">{t.sub}</span>
                    <div className="text-4xl md:text-7xl font-black italic tracking-tighter leading-none mt-2">{t.price}</div>
                  </div>
                </div>

                <h2 className="text-5xl md:text-[8vw] font-black leading-none italic uppercase tracking-tighter mb-4 md:mb-8">
                  {t.name}
                </h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredIndex === i ? 1 : 0,
                    y: hoveredIndex === i ? 0 : 20,
                    height: hoveredIndex === i ? "auto" : 0
                  }}
                  className="flex flex-col gap-2 md:gap-4 overflow-hidden"
                >
                  {t.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 md:gap-4 text-xs md:text-xl font-black italic">
                      <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-current" />
                      {f}
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* ACTION AREA */}
              <div className="flex items-end justify-between mt-8 md:mt-0">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 md:border-8 border-current flex items-center justify-center group-hover:bg-[#B0FFFA] group-hover:text-[#FF0087] transition-all transform group-hover:scale-110">
                  <ArrowUpRight size={30} className="md:w-[50px] md:h-[50px]" />
                </div>
              </div>

            </div>

            {/* Shifting Glow Line */}
            <motion.div
              animate={{ opacity: hoveredIndex === i ? 0.15 : 0 }}
              className="absolute inset-0 bg-gradient-to-t from-current to-transparent pointer-events-none"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
