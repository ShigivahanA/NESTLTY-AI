import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, MessageSquareQuote, Volume2 } from 'lucide-react';
import { useState } from 'react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: "ADD THE HERO",
      desc: "Create a profile for your child with their names, quirks, and favorites.",
      icon: <UserPlus className="w-8 h-8" />,
    },
    {
      id: 2,
      title: "SHARE THE DAY",
      desc: "Input the raw magic of their daily highlights. What they did and learned today.",
      icon: <MessageSquareQuote className="w-8 h-8" />,
    },
    {
      id: 3,
      title: "WEAVE THE MAGIC",
      desc: "Our neural engines transform the input into a cinematic narrated experience.",
      icon: <Volume2 className="w-8 h-8" />,
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#B0FFFA] text-[#FF0087] flex flex-col items-center justify-center font-sans px-6 overflow-hidden">
      <h2 className="text-5xl md:text-7xl font-black text-center mb-25 tracking-tighter italic uppercase">
        HOW IT <span className="text-[#00F7FF]">WORKS</span>
      </h2>

      <div className="relative w-full max-w-5xl h-[600px] flex items-center justify-center">

        {/* THE CURVED PATH - SIMPLE & CLEAN */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 500">
          <path
            d="M 100,200 Q 500,600 900,200"
            stroke="#FF0087"
            strokeWidth="3"
            fill="none"
            className="opacity-20"
          />
          <motion.path
            d="M 100,200 Q 500,600 900,200"
            stroke="#00F7FF"
            strokeWidth="4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: (activeStep + 1) / 3 }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        {/* THREE NODES - MINIMALIST */}
        <div className="absolute inset-0 flex items-center justify-between px-0 md:px-10 z-20">
          {/* STEP 1 */}
          <button onClick={() => setActiveStep(0)} className="group relative">
            <motion.div
              animate={{ backgroundColor: activeStep === 0 ? "#FF0087" : "#B0FFFA" }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#FF0087] flex flex-col items-center justify-center text-[#FF0087] group-hover:scale-105 transition-transform"
            >
              <span className={`text-3xl font-black ${activeStep === 0 ? 'text-[#B0FFFA]' : 'text-[#FF0087]'}`}>1</span>
              <span className={`text-[10px] font-black uppercase ${activeStep === 0 ? 'text-[#B0FFFA]' : 'text-[#FF0087]'}`}>START</span>
            </motion.div>
          </button>

          {/* STEP 2 */}
          <button onClick={() => setActiveStep(1)} className="group relative translate-y-[150px] md:translate-y-[210px]">
            <motion.div
              animate={{ backgroundColor: activeStep === 1 ? "#00F7FF" : "#B0FFFA" }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#FF0087] flex flex-col items-center justify-center text-[#FF0087] group-hover:scale-105 transition-transform"
            >
              <span className="text-3xl font-black">2</span>
              <span className="text-[10px] font-black uppercase">PROCESS</span>
            </motion.div>
          </button>

          {/* STEP 3 */}
          <button onClick={() => setActiveStep(2)} className="group relative">
            <motion.div
              animate={{ backgroundColor: activeStep === 2 ? "#FF7DB0" : "#B0FFFA" }}
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              className="w-24 h-24 md:w-32 md:h-32 border-4 border-[#FF0087] flex flex-col items-center justify-center text-[#FF0087] group-hover:scale-105 transition-transform"
            >
              <span className="text-3xl font-black">3</span>
              <span className="text-[10px] font-black uppercase">FINAL</span>
            </motion.div>
          </button>
        </div>

        {/* CENTRAL INFO CARD - CLEAN & BOLD */}
        <div className="absolute z-10 w-full max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="bg-[#FF0087] p-10 md:p-16 rounded-[4rem] border-8 border-[#FF7DB0] text-[#B0FFFA] text-center shadow-2xl"
            >
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-[#B0FFFA] text-[#FF0087] rounded-3xl">
                  {steps[activeStep].icon}
                </div>
              </div>
              <h3 className="text-4xl md:text-5xl font-black mb-6 italic tracking-tighter uppercase leading-none">
                {steps[activeStep].title}
              </h3>
              <p className="text-xl font-bold opacity-80 leading-snug">
                {steps[activeStep].desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
