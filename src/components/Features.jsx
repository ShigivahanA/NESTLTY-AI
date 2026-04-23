import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

const FeatureCard = ({ id, title, desc, color, accent }) => {
  return (
    <div className="relative w-screen h-screen flex-shrink-0 flex items-center justify-center p-6 md:px-24">
      {/* 3D Pivot Container */}
      <div className="relative w-full max-w-7xl h-[70vh] group">

        {/* The "Main" Visual layer */}
        <div
          style={{ backgroundColor: color }}
          className="absolute inset-0 rounded-[5rem] overflow-hidden border-8 border-[#FF0087]/20 shadow-2xl transition-all duration-700 group-hover:scale-[0.98]"
        >
          {/* Generative SVG Background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <pattern id={`pattern-${id}`} x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill={accent} />
                <path d="M 0 50 L 100 50 M 50 0 L 50 100" stroke={accent} strokeWidth="0.5" fill="none" />
              </pattern>
              <rect width="100%" height="100%" fill={`url(#pattern-${id})`} />
            </svg>
          </div>

          {/* Large Phantom ID */}
          <div className="absolute -bottom-20 -left-10 text-[30vw] font-black italic text-[#B0FFFA]/5 select-none pointer-events-none">
            {id}
          </div>

          {/* Content Overlay */}
          <div className="relative h-full flex flex-col justify-between p-12 md:p-20 z-10">
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <span className="text-xs font-black tracking-[0.6em] text-[#B0FFFA] uppercase mb-4 italic">MODULE_{id}</span>
                <h3 className="text-6xl md:text-9xl font-black text-[#B0FFFA] tracking-tighter leading-none italic uppercase">
                  {title.split(' ').map((word, i) => (
                    <span key={i} className="block">{word}</span>
                  ))}
                </h3>
              </div>
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-3xl border-4 border-[#B0FFFA] flex items-center justify-center text-[#B0FFFA] group-hover:bg-[#B0FFFA] group-hover:text-[#FF0087] transition-all">
                <ArrowUpRight size={48} className="group-hover:rotate-45 transition-transform" />
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="text-2xl md:text-4xl font-bold text-[#B0FFFA]/80 leading-tight italic mb-8">
                {desc}
              </p>
              <div className="flex items-center gap-4 text-[#00F7FF]">
                <Sparkles className="animate-pulse" />
                <span className="text-xs font-black tracking-widest uppercase">Proprietary Magic Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Features() {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // 5 modules total (Intro + 3 Features + Final)
  // Distance to travel = (5 - 1) * 100vw = 400vw
  const xRaw = useTransform(scrollYProgress, [0, 1], ["0vw", "-400vw"]);

  const x = useSpring(xRaw, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const features = [
    {
      id: "01",
      title: "NEURAL WEAVING",
      desc: "Built for growth. Our engine learns and builds worlds specific to your child's personality.",
      color: "#FF0087",
      accent: "#00F7FF"
    },
    {
      id: "02",
      title: "SILKY AUDIO",
      desc: "Warm, AI voices whisper-tuned for the ultimate bedtime calm and safety.",
      color: "#00F7FF",
      accent: "#FF0087"
    },
    {
      id: "03",
      title: "MEMORY VAULT",
      desc: "Every detail captured. Every small triumph turned into an epic adventure forever.",
      color: "#FF7DB0",
      accent: "#FF0087"
    }
  ];

  return (
    <section ref={targetRef} className="relative h-[600vh] bg-[#B0FFFA] overflow-visible">
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden z-20">
        <motion.div style={{ x }} className="flex">
          {/* INTRO MODULE */}
          <div className="w-screen h-screen shrink-0 flex flex-col justify-center px-6 md:px-32">
            <div className="flex items-center gap-6 text-[#00F7FF] font-black tracking-[0.5em] text-xs uppercase mb-8">
              <div className="h-px w-12 bg-[#00F7FF]" />
              Core Capabilities
            </div>
            <h2 className="text-7xl md:text-[14rem] font-black text-[#FF0087] tracking-tighter leading-[0.8] italic uppercase">
              BEYOND <br />
              <span className="text-[#00F7FF]">REALITY.</span>
            </h2>
            <div className="mt-20 flex items-center gap-4 text-[#FF0087] font-bold text-xl uppercase tracking-widest animate-bounce">
              <span>Scroll to explore</span>
              <div className="w-12 h-px bg-[#FF0087]" />
            </div>
          </div>

          {/* FEATURE MODULES */}
          {features.map((f) => (
            <FeatureCard key={f.id} {...f} />
          ))}

          {/* FINAL MODULE */}
          <div className="w-screen h-screen shrink-0 flex flex-col items-center justify-center bg-[#FF0087] text-[#B0FFFA]">
            <div className="text-center px-6">
              <h4 className="text-7xl md:text-[12rem] font-black italic uppercase tracking-tighter leading-[0.8] mb-12">
                READY <br /> FOR <br /> <span className="text-[#00F7FF]">MORE?</span>
              </h4>
              <div className="w-32 h-2 bg-[#00F7FF] mx-auto" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
